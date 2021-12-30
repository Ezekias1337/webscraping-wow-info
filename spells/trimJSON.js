const fs = require("fs");
const fileName = "./backupResults.json";
const file = require(fileName);

/* 
    I had a bug causing description to include item lvl, didn't want to rescrape old
    data, so used this code to remove that junk data from what was included
*/


for (const item of file) {
  if (item?.description && item.description.includes("Item Level")) {
    delete item.description;
  }
}

fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
  if (err) return console.log(err);
  console.log(JSON.stringify(file));
  console.log("writing to " + fileName);
});
