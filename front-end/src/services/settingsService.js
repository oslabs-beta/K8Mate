const index = async () => {
    try {
      const response = await fetch("http://localhost:8080/setting", {
        headers: { "Content-Type": "application/json" },
      });
      return response.json();
    } catch (err) {
      console.log(err);
    }
  };

const update = async (formData) => {
  console.log("formdata hitting settingService.js:", formData);
  try {
    const response = await fetch("http://localhost:8080/setting/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

export { index, update };
