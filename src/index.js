// let addToy = false;

// document.addEventListener("DOMContentLoaded", () => {
//   const addBtn = document.querySelector("#new-toy-btn");
//   const toyFormContainer = document.querySelector(".container");
//   addBtn.addEventListener("click", () => {
//     // hide & seek with the form
//     addToy = !addToy;
//     if (addToy) {
//       toyFormContainer.style.display = "block";
//     } else {
//       toyFormContainer.style.display = "none";
//     }
//   });
// });

let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");

  // Toggle form visibility
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch toys from API
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        const toyCard = createToyCard(toy);
        toyCollection.appendChild(toyCard);
      });
    });

  // Function to create toy card
  function createToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";

    const h2 = document.createElement("h2");
    h2.innerText = toy.name;

    const img = document.createElement("img");
    img.src = toy.image;
    img.className = "toy-avatar";

    const p = document.createElement("p");
    p.innerText = `${toy.likes} Likes`;

    const button = document.createElement("button");
    button.className = "like-btn";
    button.id = toy.id;
    button.innerText = "Like ❤️";
    button.addEventListener("click", () => likeToy(toy, p));

    card.append(h2, img, p, button);
    return card;
  }

  // Function to like a toy
  function likeToy(toy, p) {
    const newLikes = toy.likes + 1;
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ likes: newLikes })
    })
    .then(response => response.json())
    .then(updatedToy => {
      toy.likes = updatedToy.likes;
      p.innerText = `${updatedToy.likes} Likes`;
    });
  }

  // Add new toy
  const toyForm = document.querySelector(".add-toy-form");
  toyForm.addEventListener("submit", event => {
    event.preventDefault();
    const name = event.target.name.value;
    const image = event.target.image.value;
    const newToy = {
      name,
      image,
      likes: 0
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
    .then(response => response.json())
    .then(toy => {
      const toyCard = createToyCard(toy);
      toyCollection.appendChild(toyCard);
      toyForm.reset();
      toyFormContainer.style.display = "none";
      addToy = false;
    });
  });
});
