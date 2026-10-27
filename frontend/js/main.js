fetch("http://localhost:3000/")
    .then(response => response.text())
    .then(data => {
        console.log("APIからの応答:", data);
    })
    .catch(error => {
        console.error("APIとの通信に失敗:", error);
    });
