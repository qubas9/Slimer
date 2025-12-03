const Feedback = {
  url: "https://docs.google.com/forms/d/e/1FAIpQLSf0uOhSqOoGlKBKwCfAeQKKaHGlcCr5zbJ7SKkjBGPYIHPHvg/viewform?usp=pp_url&entry.286032006=v0.0.1",

  load(callback) {
    if (this.version) {
      if (callback) callback();
      return;
    }
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "./package.json", true);
    xhr.responseType = "json";

    xhr.onload = () => {
      if (xhr.status === 200) {
        const version = xhr.response.version || "unknown";
        this.version = version;

        // nahradíme jen poslední část URL (=verzi)
        this.url = this.url.replace(/(entry\.286032006=).+$/, `$1${encodeURIComponent(version)}`);

        console.log("Odkaz připraven:", this.url);
        if (callback) callback();
      } else {
        console.error("Chyba při načítání package.json:", xhr.status);
      }
    };

    xhr.onerror = () => console.error("Nepodařilo se načíst package.json");
    xhr.send();
  }
};
export default Feedback;