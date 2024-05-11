const scrollToTemplates = () => {
    const scrollToElement = document.getElementById("templates");
    if (scrollToElement) {
      scrollToElement.scrollIntoView({ behavior: "smooth" });
    }
  };