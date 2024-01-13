
document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-logs");

    const token = document.getElementsByName('csrf-token')[0].content


    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const term = searchInput.value;

        fetch("/searches", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify({ term: term, authenticity_token: token })
        })
        .then((res) => res.json())
        .then((data) => {
            fetch("/searches")
                .then((response) => response.text())
                   .then((html) => {
                       searchResults.innerHTML = html;
                   });
        });

        searchInput.value = "";
    });
});

console.log("Searches JavaScript loaded!");
