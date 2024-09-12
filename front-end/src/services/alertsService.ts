/* ----------------------------------------- ALERTS ----------------------------------------- */

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
    });
    if (!response.ok) { throw new Error (`Failed to get alerts`); }
    return response.json();
  } catch (err) { console.error(err); };
}

const putAlerts = async (name: string, db_id: string, status: string) => {
  try {
    console.log(name, db_id, status);
    const response = await fetch('http://localhost:8080/alert/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, db_id, status })
    });
    if(!response.ok) { throw new Error ('Failed to update alert status'); }
    return;
  } catch (err) { console.error(err); }
}

const deleteAlerts = async (id: string, log: string) => {
  try {
    const response = await fetch('http://localhost:8080/alert/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, log })
    });
    if(!response.ok) { throw new Error ('Failed to delete alert'); }
    return response.json();
  } catch (err) { console.error(err); }
}


/* -------------------------------------- ALERT CONTEXT -------------------------------------- */

//make promethus query to cluster
const promQuery = async (query: string) => {
  try {
    const response = await fetch(`http://localhost:9090/api/v1/query?query=${query}`);
    if (!response.ok) { throw new Error ('Failed to fetch'); }
    return response.json();
  } catch (err) { console.error(err); }
}
export { createAlert, getAlerts, putAlerts, deleteAlerts, promQuery };