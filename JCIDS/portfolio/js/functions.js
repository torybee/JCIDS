function findLifeCycle(string) {
  switch (string) {
    case "Material Solutions Analysis":
      return ".msa";
    case "Technology Maturation & Risk Reduction":
      return ".tmrr";
    case "Engineering & Manufacturing Development":
      return ".emd";
    case "Production & Deployment":
      return ".pd";
    case "Operations & Support":
      return ".os";
  }
}

function findCategory(string) {
  switch (string) {
    case "ACAT I":
      return ".a1";
    case "ACAT II":
      return ".a2";
    case "ACAT III":
      return ".a3";
    case "ACAT IV":
      return ".a4";
    case "Special Interest":
      return ".si";
  }
}