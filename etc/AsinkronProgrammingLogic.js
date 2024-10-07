console.log("Sebelum Promise");
let janji = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Janji terpenuhi");
    }, 2000);
});

janji.then((result) => {
    console.log(result); // "Janji terpenuhi" setelah 2 detik
});
console.log("Setelah Promise");
