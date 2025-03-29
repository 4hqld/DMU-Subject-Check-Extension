document.addEventListener("DOMContentLoaded", function () {
    console.log("🔄 팝업이 새로 열렸습니다.");

    // chrome.storage에서 마지막 상태 불러오기
    chrome.storage.local.get(['loginStatus', 'assignments'], function(result) {
        if (result.loginStatus) {
            document.getElementById("status-message").textContent = result.CheckStatus;
        } else {
            document.getElementById("status-message").textContent = "🔄 확인 중...";
        }

        if (result.assignments && result.assignments.length > 0) {
            updateAssignmentUI(result.assignments);
        }
    });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs.length === 0) {
            document.getElementById("status-message").textContent = "⚠ 오류: 활성 탭 없음";
            handleLogout();
            return;
        }
    
        let activeTabId = tabs[0].id;
    
        chrome.tabs.sendMessage(activeTabId, { action: "check_login_status" }, function (response) {
            if (chrome.runtime.lastError || !response || !response.loggedIn) {
                console.warn("⛔ 로그인 감지 실패 또는 로그아웃 상태");
                handleLogout();
                return;
            }

            document.getElementById("status-message").textContent = "✅ 로그인 확인";
                
            // 기존 크롤링 데이터 요청
            chrome.runtime.sendMessage({ action: "get_assignments" }, function (data) {
                if (chrome.runtime.lastError) {
                    console.error("❌ 백그라운드 메시지 오류:", chrome.runtime.lastError.message);
                    return;
                }
    
                if (data && data.assignments.length > 0) {
                    document.getElementById("status-message").textContent = "✅ 확인 완료";
                } else {
                    console.log("📭 저장된 과제 없음. 새로 크롤링 요청");
                    chrome.tabs.sendMessage(activeTabId, { action: "check_assignments" });
                }
            });
        });
    });
});

// 로그아웃 시 데이터 삭제
function handleLogout() {
    document.getElementById("status-message").textContent = "⛔ 로그인 감지 실패 또는 로그아웃 상태";
    document.getElementById("assignment-status").innerHTML = ""; //UI 초기화

    chrome.runtime.sendMessage({ action: "clear_assignments" }); //백그라운드에 데이터 삭제 요청
}

// 크롤링된 데이터 표시
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "update_assignment_status") {
        updateAssignmentUI(message.data);
        chrome.storage.local.set({ assignments: message.data }); // 과제 상태 저장
    }
    if (message.action === "loading") {
        document.getElementById("status-message").textContent = "🔄 확인 중...";
        document.getElementById("status-title").textContent = "과제 제출 여부";
    }
    if (message.action === "done") {
        document.getElementById("status-message").textContent = "✅ 확인 완료";
    }
});

// UI 업데이트 함수 (과제 링크 추가)
function updateAssignmentUI(assignments) {
    let status = document.getElementById("assignment-status");
    status.innerHTML = "";

    let filteredAssignments = assignments.filter(a => a.week !== "주차 미확인" && !a.isSubmitted);

    if (filteredAssignments.length === 0) {
        document.getElementById("status-message").textContent = "✅ 모든 과제 제출 완료";
        return;
    }

    filteredAssignments.forEach((a) => {
        let item = document.createElement("p");

        // 과제 제출 페이지 URL이 있는 경우만 링크 추가
        if (a.assignmentId) {
            let assignmentUrl = `https://eclass.dongyang.ac.kr/mod/assign/view.php?id=${a.assignmentId}`;
            item.innerHTML = `📌 ${a.course} <br> 📅 ${a.week}주차 (마감: ${a.deadline}) <br>
                <a href="${assignmentUrl}" target="_blank" style="color: red; text-decoration: underline;">❌ 미제출 (바로가기)</a>`;
        } else {
            item.innerHTML = `📌 ${a.course} <br> 📅 ${a.week}주차 (마감: ${a.deadline}) <br> ❌ 미제출`;
        }

        status.appendChild(item);
    });
}


