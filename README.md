# Hyderabad Metro Route Finder 🚇

This project simulates the **Hyderabad Metro route system**, allowing users to plan metro journeys quickly and accurately.

Users can:

* ✅ Find the **shortest route** between two stations using **Dijkstra’s algorithm**  
* ✅ View **total distance**, **fare**, and **metro line information**  
* ✅ Interact with a clean and responsive **web interface** to explore the metro map  

👉 **Live Website:** [https://hyderabad-metro-app.onrender.com](https://hyderabad-metro-app.onrender.com)  
🔗 **GitHub Profile:** [@sujithreddy0007](https://github.com/sujithreddy0007)

---

## 🌟 Features

* 🔍 **Route Finder:** Enter source and destination stations to get the shortest path  
* 🗺️ **Metro Line Guidance:** Each segment shows the corresponding metro line  
* 📏 **Distance Calculation:** Total kilometers are displayed for your trip  
* 💸 **Fare Estimator:** Get the fare using: ₹10 base + ₹2/km  
* 📊 **Network View:** Full graph of the metro network rendered in a readable format  
* 💻 **Fully Client-side:** Built using **HTML**, **CSS**, and **JavaScript**  
* 🖼️ **Responsive UI:** Mobile-friendly and optimized for various screen sizes  
* 📂 **Modular Code:** Separated files for map rendering, data handling, and styling  

---

## 🧠 Algorithms Used

### Dijkstra's Algorithm

* Used to find the **shortest path** in a weighted graph.  
* Accounts for multiple paths, selecting the one with the minimum total distance.  
* Tracks metro line transitions and segments clearly.

### Fare Calculation Formula

$$
\text{Total Fare} = \text{Base Fare} + (\text{Per Km Charge} \times \text{Total Distance})
$$

* **Base Fare:** ₹10  
* **Per Km Charge:** ₹2  

---

## 🧰 Tech Stack

| Feature              | Tech Used                                    |
| -------------------- | -------------------------------------------- |
| Shortest Path Logic  | Java (Dijkstra)                              |
| Executable Generator | `MetroApp.java` compiled to `hyderabad_metro.exe` |
| Web UI               | HTML, CSS, JavaScript                        |
| Hosting              | Render                                       |

---

## 🚀 How to Run Locally

### Option 1: View Website

Simply open [https://hyderabad-metro-app.onrender.com](https://hyderabad-metro-app.onrender.com) in any browser.

---

### Option 2: Run Java Program

1. Clone the repo:

```bash
git clone https://github.com/sujithreddy0007/Hyderabad-Metro-App.git
cd Hyderabad-Metro-App
```
2 .Compile:
```
javac hydMetro.java
```

3 .Run:
```
java hydMetro
```

✨ Example Output
Enter source station: Ameerpet
Enter destination station: L.B. Nagar

Shortest Path:
Ameerpet (Red Line) -> Hitec City (Blue Line) -> L.B. Nagar
Total Distance: 18 km
Total Fare: ₹46

## Done by Sujith