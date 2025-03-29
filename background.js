let cachedAssignments = []; // 크롤링된 과제 데이터를 저장

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "open_popup") {
        console.log("📢 팝업 실행 요청됨");
        chrome.action.openPopup();
    }

    if (message.action === "update_assignment_status") {
        console.log("📄 크롤링 데이터 업데이트:", message.data);
        cachedAssignments = message.data; // 크롤링된 데이터 저장

        // 팝업이 실행 중이면 즉시 업데이트
        chrome.runtime.sendMessage({ action: "display_assignments", data: cachedAssignments });

        // chrome.storage.local에도 저장
        chrome.storage.local.set({ assignments: cachedAssignments });
    }

    if (message.action === "get_assignments") {
        console.log("📡 저장된 과제 데이터를 요청받음");
        sendResponse({ assignments: cachedAssignments });
        return true; // 비동기 응답 보장
    }

    if (message.action === "clear_assignments") {
        console.log("🗑 과제 데이터 삭제 요청");
        cachedAssignments = []; // 메모리에서 삭제
        chrome.storage.local.remove("assignments"); // 저장된 데이터 삭제
    }
});
