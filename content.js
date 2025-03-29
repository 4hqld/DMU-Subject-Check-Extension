console.log("✅ eClass 페이지 감지됨");

// 현재 URL 검사
const currentUrl = window.location.href;
const isMainPage = /^https:\/\/eclass\.dongyang\.ac\.kr\/?$/.test(currentUrl);

let isCrawling = false;
let isPopupOpened = false;

let interval = setInterval(() => {
    let logoutButton = document.querySelector("a.btn.btn-person");

    if (logoutButton) {
        console.log("✅ 로그인 성공");

        if (!isPopupOpened && isMainPage) {
            isPopupOpened = true; // 중복 실행 방지
            chrome.runtime.sendMessage({ action: "open_popup" });
        }

        clearInterval(interval);

        if (!isCrawling) {
            isCrawling = true;
            setTimeout(scrapeAssignments, 3000);
        }
    }
}, 1000);


// 과제 크롤링 (강좌 목록 확인)
async function scrapeAssignments() {
    console.log("📡 과제 크롤링 시작...");
    chrome.runtime.sendMessage({ action: "clear_assignments" }); // 백그라운드에 데이터 삭제 요청
    chrome.runtime.sendMessage({ action: "loading" });

    let classList = document.querySelectorAll(".course_lists li a.course_link");
    let assignments = [];

    if (classList.length === 0) {
        console.warn("⚠ 강좌 목록이 감지되지 않음.");
        return;
    }

    // 각 강좌에서 과제 페이지 크롤링
    for (let course of classList) {
        let courseName = course.innerText.trim();
        let courseUrl = course.href;
        let courseId = new URL(courseUrl).searchParams.get("id");

        let assignmentPageUrl = `https://eclass.dongyang.ac.kr/mod/assign/index.php?id=${courseId}`;
        let assignmentData = await fetchAssignmentPage(assignmentPageUrl, courseName);

        assignments.push(...assignmentData);
    }

    console.log("📋 크롤링된 과제 목록:", assignments);
    chrome.runtime.sendMessage({ action: "done" });

    // 주차 미확인 과제는 제외하고 팝업에 전달
    let filteredAssignments = assignments.filter(a => a.week !== "주차 미확인");
    chrome.runtime.sendMessage({ action: "update_assignment_status", data: filteredAssignments });
}

// 개별 과목 과제 크롤링
async function fetchAssignmentPage(url, courseName) {
    try {
        let response = await fetch(url, { credentials: "include" });
        let text = await response.text();
        let parser = new DOMParser();
        let doc = parser.parseFromString(text, "text/html");

        let assignmentRows = doc.querySelectorAll("table.generaltable tbody tr");
        let results = [];

        if (assignmentRows.length === 0) {
            courseName = courseName.replace(/^교과교과\s*/g, '').replace(/\n.*$/g, '');
            console.warn(`⚠ 과제 목록이 없음: ${courseName}`);
            return results;
        }

        for (let row of assignmentRows) {
            let week = row.querySelector("td.cell.c0")?.innerText?.trim() || "주차 미확인";
            let period = row.querySelector("td.cell.c2")?.innerText?.trim() || "마감일 없음";
            let status = row.querySelector("td.cell.c3")?.innerText?.trim() || "";

            // 과제 링크 확인 후 처리
            let assignmentLinkElement = row.querySelector("td.cell.c1 a");
            if (!assignmentLinkElement) {
                continue;
            }

            let assignmentLink = assignmentLinkElement.href;
            let assignmentId = new URL(assignmentLink).searchParams.get("id");

            if (!assignmentId) {
                console.warn("🚨 과제 ID 추출 실패:", assignmentLink);
                continue;
            }

            // 제출된 과제 제외
            if (week === "주차 미확인" || status.includes("제출 완료")) {
                continue;
            }

            // "교과교과" 제거
            courseName = courseName.replace(/^교과교과\s*/g, '').replace(/\n.*$/g, '');

            results.push({
                course: courseName,
                week,
                deadline: period,
                isSubmitted: status.includes("제출 완료"),
                assignmentId // 과제 ID 추가
            });
        }

        return results;
    } catch (error) {
        console.error("❌ 과제 페이지 크롤링 실패:", error);
        return [];
    }
}


// 팝업에서 로그인 상태 및 과제 데이터 요청 처리
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "check_login_status") {
        let logoutButton = document.querySelector("a.btn.btn-person");
        let isLoggedIn = !!logoutButton;

        console.log("🔍 로그인 상태 확인:", isLoggedIn ? "✅ 로그인됨" : "⛔ 로그아웃됨");
        sendResponse({ loggedIn: isLoggedIn });
    }

    if (message.action === "check_assignments") {
        if (!isCrawling) {
            isCrawling = true; // 크롤링 시작
            scrapeAssignments().then(() => {
                console.log("📄 과제 크롤링 완료");
                sendResponse({ success: true });
            }).catch((error) => {
                console.error("❌ 과제 크롤링 오류:", error);
                sendResponse({ success: false });
            });
        } else {
            console.log("🚫 크롤링이 이미 실행 중입니다.");
            sendResponse({ success: false });
        }

        return true; // 비동기 처리
    }

    return true;
});
