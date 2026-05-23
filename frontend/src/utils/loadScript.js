export const loadScript = (src, id) =>
  new Promise((resolve, reject) => {
    const existingScript = id ? document.getElementById(id) : null;

    if (existingScript) {
      resolve(existingScript);
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;

    if (id) {
      script.id = id;
    }

    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
