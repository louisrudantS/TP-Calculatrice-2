
class BaseCalculator {
  constructor() {
    // Eléments mémoire et écran
    this.memoireElt = document.querySelector("#memoire");
    this.ecranElt = document.querySelector("#ecran");

    // On stocke la valeur de l'écran "précédent"
    this.precedent = 0;

    // On stocke l'affichage
    this.affichage = "";

    // On stocke l'opération
    this.operation = null;

    // On initialise la mémoire
    this.memoire = 0;

    window.onload = () => {
      // On écoute les clics sur les touches
      let touches = document.querySelectorAll("span");
      for (let touche of touches) {
        touche.addEventListener("click", (event) => this.gererTouches(event));
      }
    }

    // On écoute les touches du clavier
    document.addEventListener("keydown", (event) => this.gererTouches(event));

    // Récupération de la mémoire depuis le stockage local
    this.memoire =
      localStorage.memoire !== undefined
        ? parseFloat(localStorage.memoire)
        : 0;
    if (this.memoire !== 0) this.memoireElt.style.display = "initial";
  }

  /**
   * Cette méthode réagit au clic sur les touches
   * @param {Event} event
   */
  gererTouches(event) {
    let touche;

    // On liste les touches autorisées
    const listeTouches = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "+",
      "-",
      "*",
      "/",
      ".",
      "Enter",
      "Escape",
      "Backspace",
    ];
      // On vérifie si on a l'évènement "keydown"
      if (event.type === "keydown") {
        // On compare la touche appuyée aux touches autorisées
        if (listeTouches.includes(event.key)) {
          // On empêche l'utilisation "par défaut" de la touche
          event.preventDefault();
          // On stocke la touche choisie dans la variable touche
          touche = event.key;
        }
      } else {
        touche = event.target.innerText;
      }
  
      // On vérifie si chiffre ou .
      if (parseFloat(touche) >= 0 || touche === ".") {
        // A vérifier, pas plusieurs . dans la chaîne
        // On met à jour la valeur d'affichage et on affiche sur l'écran
        this.affichage = (this.affichage === "") ? touche.toString() : this.affichage + touche.toString();
        this.ecranElt.innerText = this.affichage;
      } else {
        switch (touche) {
          // Touche C réinitialise tout
          case "C":
          case "Escape":
            this.precedent = 0;
            this.affichage = "";
            this.operation = null;
            this.ecranElt.innerText = 0;
            break;
          // Calculs
          case "+":
          case "-":
          case "*":
          case "/":
            // On calcule la valeur résultat de l'étape précédente
            this.precedent =
              this.precedent === 0
                ? parseFloat(this.affichage)
                : this.calculer(this.precedent, parseFloat(this.affichage), this.operation);
            // On met à jour l'écran
            this.ecranElt.innerText = this.precedent + touche;
            // On stocke l'opération
                this.operation = touche;
                // On réinitialise la variable d'affichage
                this.affichage = "";  
                break;
            case "=":
            case "Enter":
                // On calcule la valeur résultat de l'étape précédente
                this.precedent = (this.precedent === 0) ? parseFloat(this.affichage) : this.calculer(this.precedent, parseFloat(this.affichage), this.operation);
                // On met à jour l'écran
                this.ecranElt.innerText = this.precedent; 
                // On stocke le résultat dans la variable d'affichage
                this.affichage = this.precedent;
                // On réinitialise précédent
                this.precedent = 0;
                
                break;
            // On gère la mémoire
            case "M+":
                // On stocke (en additionnant) à la valeur déjà en mémoire
                localStorage.memoire = (localStorage.memoire) ? parseFloat(localStorage.memoire) + parseFloat(this.affichage) : parseFloat(this.affichage);
                // On affiche le M
                this.memoireElt.style.display = "initial";
                break; 
            case "MC": 
                // On efface la mémoire 
                localStorage.memoire = 0;
                // On efface le M
                this.memoireElt.style.display = "none";
                break;
            case "MR":
                // On récupère la valeur stockée
                this.memoire = (localStorage.memoire) ? parseFloat(localStorage.memoire) : 0;
                this.affichage = this.memoire;
                this.ecranElt.innerText = this.memoire;
                break;
            case "Backspace":
              // Supprime le dernier caractère de l'affichage
              
              this.affichage = this.affichage.substring("", this.affichage.length - 1);
              this.ecranElt.innerText = this.affichage;
              break;

            default:
                break;
            }
          } 
    }
        
    /**
     * Effectue le calcul
     * @param {number} nb1 
     * @param {number} nb2 
     * @param {string} _operation 
     * @returns number
     */


    calculer(nb1, nb2, _operation){
        nb1 = parseFloat(nb1);
        nb2 = parseFloat(nb2);
        if(this.operation === "+") return nb1 + nb2;
        if(this.operation === "-") return nb1 - nb2;
        if(this.operation === "*") return nb1 * nb2;
        if(this.operation === "/") return nb1 / nb2;
    }

}

let baseCalculator = new BaseCalculator();