//post an alert into the ALERTS TABLE
const createAlert = async (category: string, name: string, log: string, id: string | null = null) => {
  try {
    const response = await fetch ('http://localhost:8080/alert/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, name, id, log })
    });
    if (!response.ok) { throw new Error (`${category} alert failed to send`); }
    return response.json();
  } catch (err) { console.error(err); }
};

//get all alerts from ALERTS TABLE
const getAlerts = async () => {
  try{
    const response = await fetch('http://localhost:8080/alert/all', {
      headers: { 'Content-Type': 'application/json' }
    })
    if (!response.ok) { throw new Error (`Failed to get alerts`); }
    return response.json();
  } catch (err) { console.error(err) };
}

const promQuery = async (query: string) => {
  try {
    const response = await fetch(`http://localhost:9090/api/v1/query?query=${query}`);
    if (!response.ok) { throw new Error ('Failed to fetch'); }
    return response.json();
  } catch (err) { console.error(err) }
}
export { createAlert, getAlerts, promQuery };