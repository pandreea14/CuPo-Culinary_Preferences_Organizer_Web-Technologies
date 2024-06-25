import { removeFromFavorites } from "./addToFavorites.js";
import { fetchAndDisplayShoppingLists } from "./addToShoppingList.js";
import { getToken, parseJwt } from "./tokenScript.js";

async function loadFavorites() {
  const token = getToken();
  const user = parseJwt(token);

  let favoriteFoods = [];
  try {
    const favoriteResponse = await fetch(`/api/favorites?user=${user.email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!favoriteResponse.ok) {
      throw new Error("Failed to fetch favorite food data");
    }
    favoriteFoods = await favoriteResponse.json();

    const favoriteContainer = document.querySelector(".product-container");
    if (!favoriteContainer) {
      console.error("Favorite container not found");
      return;
    }
    favoriteContainer.innerHTML = ""; 

    if (favoriteFoods.length === 0) {
      favoriteContainer.innerHTML =
        "<p>Haven't selected any favorite foods yet!</p>";
    } else {
      favoriteFoods.forEach((favoriteFood) => {
        const favoriteHtml = `
                    <div class="product-item">
                        <h2>${favoriteFood.name}</h2>
                        <div class="product-info">
                            <img src="${favoriteFood.image}" alt="${favoriteFood.name}" class="image">
                            <div class="details">
                                <p>Calories: ${favoriteFood.calories} <br> Allergens: ${favoriteFood.alergens} <br> Expiration: ${favoriteFood.expiration}</p>
                            </div>
                        </div>
                        <div class="buttons">
                            <button class="remove-button">Remove</button>
                            <button class="shopping-button">Add to shopping list</button>
                        </div>
                    </div>
                `;
        favoriteContainer.insertAdjacentHTML("beforeend", favoriteHtml);
      });
    }

    favoriteContainer.addEventListener("click", function (event) {
      if (event.target.classList.contains("remove-button")) {
        const productItem = event.target.closest(".product-item");
        const foodName = productItem.querySelector("h2").textContent;
        removeFromFavorites(foodName, event.target);
        // removeFromFavorites(productItem);
        console.log(
          "Removed from favorites:",
          productItem.querySelector("h2").textContent
        );
        productItem.remove();
      } else if (event.target.classList.contains("shopping-button")) {
        const productItem = event.target.closest(".product-item");
        const foodItem = productItem.querySelector('h2').textContent;
        const shoppingListModal = document.getElementById("shoppingListModal");
        if (shoppingListModal) {
            shoppingListModal.style.display = "block";
            fetchAndDisplayShoppingLists(foodItem);
        }
      }
    });
  } catch (error) {
    console.error("An error occurred in fetching favorite food data:", error);
    alert("An error occurred in fetching favorite food data. " + error.message);
  }

    // Export favorite items to CSV
  const exportCsvButton = document.getElementById('exportCsvButton');
  if (exportCsvButton) {
    exportCsvButton.addEventListener('click', function() {
      const csvContent = convertToCSV(favoriteFoods);
      triggerCSVDownload(csvContent, 'favorite_items.csv');
    });
  }
  //export items to PDF
  const exportPdfButton = document.getElementById('exportPdfButton');
  if (exportPdfButton) {
    exportPdfButton.addEventListener('click', async function() {
      const pdfContent = await convertToPDF(favoriteFoods);
      triggerPDFDownload(pdfContent, 'favorite_items.pdf');
    });
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  await loadFavorites();

  document.body.addEventListener('click', function (event) {
    const productItem = event.target.closest('.product-item');
    if (!productItem) {
        return;
    }

    document.querySelectorAll('.product-item').forEach(item => item.classList.remove('selected'));
    productItem.classList.add('selected');

    if (event.target.classList.contains('shopping-button')) {
        const foodItem = productItem.querySelector('h2').textContent;
        const shoppingListModal = document.getElementById("shoppingListModal");
        if (shoppingListModal) {
            shoppingListModal.style.display = "block";
            fetchAndDisplayShoppingLists(foodItem);
        }
    }
});

  window.addEventListener("click", function (event) {
    const shoppingListModal = document.getElementById("shoppingListModal");
    if (event.target == shoppingListModal) {
      shoppingListModal.style.display = "none";
    }
  });

  const closeButton = document.querySelector(".modalsh .close");
  if (closeButton) {
    closeButton.addEventListener("click", function () {
      const shoppingListModal = document.getElementById("shoppingListModal");
      shoppingListModal.style.display = "none";
    });
  }
});


function convertToCSV(items) {
  if (items.length === 0) return '';
  const headers = Object.keys(items[0]).join(',');
  const rows = items.map(item => Object.values(item).join(','));
  return [headers, ...rows].join('\n');
}

function triggerCSVDownload(csvContent, fileName) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link); // Required for FF
  link.click();
  document.body.removeChild(link); // Clean up
}

async function convertToPDF(items) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(12);
  doc.text('Favorite Foods', 10, 10);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const yOffset = 20 + (i * 40);

    doc.text(`Name: ${item.name}`, 10, yOffset);
    doc.text(`Calories: ${item.calories}`, 50, yOffset);
    doc.text(`Allergens: ${item.alergens}`, 90, yOffset);
    doc.text(`Expiration: ${item.expiration}`, 130, yOffset);

    if (item.image) {
      try {
        const imageDataUrl = await getImageDataUrl(item.image);
        doc.addImage(imageDataUrl, 'JPEG', 170, yOffset, 30, 25);
      } catch (err) {
        console.warn(`Failed to load image: ${item.image}`);
      }
    }
  }

  return doc;
}

function triggerPDFDownload(pdfContent, fileName) {
  pdfContent.save(fileName);
}

async function getImageDataUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg'));
    };
    img.onerror = function (err) {
      reject(err);
    };
    img.src = url;
  });
}