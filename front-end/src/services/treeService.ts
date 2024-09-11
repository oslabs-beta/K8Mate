//get all information from SINGLE CLUSTER TABLE
const getSingleCluster = async () => {
  try {
    const response = await fetch('http://localhost:8080/cluster/all', {
      headers: { 'Content-Type': 'application/json' }
    });

    return response.json();
  } catch (err) { console.log(err); }
};

//completely wipe and refresh SINGLE CLUSTER TABLE with current cluster data
const refreshSingleCluster = async () => {
  try {
    const response = await fetch('http://localhost:8080/cluster/refresh', {
      headers: { 'Content-Type': 'application/json' }
    });

    return response.json();
  } catch (err) { console.log(err); }
};

//post a snapshot of current cluster into CLUSTER HISTORY TABLE
const postSnapshot = async () => {
  try {
    const response = await fetch('http://localhost:8080/cluster/postAll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    return response.json();
  } catch (err) { console.log(err); }
};

//get all information of CLUSTER HISTORY TABLE
const getHistory = async () => {
  try {
    const response = await fetch('http://localhost:8080/cluster/history', {
      headers: { 'Content-Type': 'application/json' }
    });

    return response.json();
  } catch (err) { console.log(err); }
};

export { getSingleCluster, refreshSingleCluster, postSnapshot, getHistory };
