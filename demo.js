const BACKEND = "YOUR_BACKEND_URL";

let chart;

function loadCandidates() {
  fetch(BACKEND + "/candidates")
    .then(r => r.json())
    .then(list => {
      const sel = document.getElementById("candidateSelect");
      list.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.name;
        sel.appendChild(opt);
      });
    });
}

function loadResults() {
  fetch(BACKEND + "/results")
    .then(r => r.json())
    .then(data => {
      const counts = data.counts;
      const labels = Object.keys(counts).map(id => "Candidate " + id);
      const values = Object.values(counts);

      if (chart) chart.destroy();
      const ctx = document.getElementById("resultsChart");
      chart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: labels,
          datasets: [{ data: values }]
        }
      });
    });
}

function demoCastVote() {
  const candidateId = document.getElementById("candidateSelect").value;
  fetch(BACKEND + "/vote", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      voter_id: 1,
      candidate_id: candidateId,
      biometric_hash: "demo_hash"
    })
  }).then(r => r.json())
    .then(out => {
      document.getElementById("voteResponse").textContent = JSON.stringify(out);
      loadResults();
    });
}

function mpesaDonate() {
  let phone = document.getElementById("phone").value;
  let amount = Number(document.getElementById("amount").value);

  fetch(BACKEND + "/mpesa/stkpush", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      phone: phone,
      amount: amount,
      account_ref: "DEMO"
    })
  })
    .then(r => r.json())
    .then(data => {
      document.getElementById("mpesaResponse").textContent = JSON.stringify(data);
    });
}

window.onload = () => {
  loadCandidates();
  loadResults();
  setInterval(loadResults, 5005);
};
