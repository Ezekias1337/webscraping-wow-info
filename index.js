const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
//const options = new chrome.Options()

function generateDelayNumber() {
  const amountToSleep = Math.floor(Math.random() * (8000 - 5000 + 1) + 5000);
  console.log(`Sleeping for: ${amountToSleep / 1000} seconds.`, amountToSleep);
  return amountToSleep;
}

async function scrapeThenWriteToJSON() {
  let resultOfScrape = await scrapeSpellInfo();
  let dataComplete = JSON.stringify(resultOfScrape[0]);
  let dataFailed = JSON.stringify(resultOfScrape[1]);

  fs.writeFileSync("successfulScrapeResults.json", dataComplete);
  fs.writeFileSync("unsuccessfulScrapeResults.json", dataFailed);
}

async function scrapeSpellInfo() {
  let driver = await new Builder().forBrowser("chrome").build();
  let arrayOfScrapedData = [];
  let arrayOfFailedSpellIDs = [];

  //for (let i = 0; i < 45000; i++) {
  for (let i = 0; i < 15; i++) {
    try {
      await driver.get(`https://tbc.wowhead.com/spell=${i}`);
      let objToPush = {};

      objToPush.ID = i;

      try {
        objToPush.spellName = await driver
          .findElement(
            By.xpath("/html/body/div[5]/div/div/div[2]/div[3]/div[3]/h1")
          )
          .getAttribute("innerText");
      } catch (error) {
        console.log(error);
      }
      try {
        objToPush.rank = await driver
          .findElement(By.xpath(`//*[text()='${"Rank"}']`))
          .getAttribute("innerText");
      } catch (error) {
        console.log(error);
      }
      try {
        objToPush.isTalent = await driver
          .findElement(
            By.xpath("/html/body/div[5]/div/div/div[2]/div[3]/div[3]/h1")
          )
          .getAttribute("innerText");
      } catch (error) {
        console.log(error);
      }
      try {
        try {
          objToPush.spellCost = await driver
            .findElement(By.xpath(`//*[text()='${"Rage"}']`))
            .getAttribute("innerText");
        } catch (error) {
          console.log(error);
        }
        try {
          objToPush.spellCost = await driver
            .findElement(By.xpath(`//*[text()='${"Focus"}']`))
            .getAttribute("innerText");
        } catch (error) {
          console.log(error);
        }
        try {
          objToPush.spellCost = await driver
            .findElement(By.xpath(`//*[text()='${"Energy"}']`))
            .getAttribute("innerText");
        } catch (error) {
          console.log(error);
        }
        try {
          objToPush.spellCost = await driver
            .findElement(By.xpath(`//*[text()='${"Combo Points"}']`))
            .getAttribute("innerText");
        } catch (error) {
          console.log(error);
        }
        try {
          objToPush.spellCost = await driver
            .findElement(By.xpath(`//*[text()='${"Happiness"}']`))
            .getAttribute("innerText");
        } catch (error) {
          console.log(error);
        }
        try {
          objToPush.spellCost = await driver
            .findElement(By.xpath(`//*[text()='${"Mana"}']`))
            .getAttribute("innerText");
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
      try {
        
        try {
          objToPush.spellRange = await driver
          .findElement(
            By.xpath(`//*[text()='${"yd range"}']`)
          )
          .getAttribute("innerText");
        } catch (error) {
          console.log(error);
        } try {
          objToPush.spellRange = await driver
          .findElement(
            By.xpath(`//*[text()='${"Melee Range"}']`)
          )
          .getAttribute("innerText");
        } catch (error) {
          console.log(error);
        }

      } catch (error) {
        console.log(error);
      }
      try {
        objToPush.spellCastTime = await driver
          .findElement(
            By.xpath(`//*[text()='${"cast"}']`)
          )
          .getAttribute("innerText");
      } catch (error) {
        console.log(error);
      }
      try {
        objToPush.spellCD = await driver
          .findElement(
            By.xpath(`//*[text()='${"cooldown"}']`)
          )
          .getAttribute("innerText");
      } catch (error) {
        console.log(error);
      }
      try {
        objToPush.spellClassRequirement = await driver
          .findElement(
            By.xpath("/html/body/div[5]/div/div/div[2]/div[4]/div[3]/div[4]/table/tbody/tr[1]/td/table[1]/tbody/tr/td/div[2]")
          )
          .getAttribute("innerText");
      } catch (error) {
        console.log(error);
      }
      try {
        objToPush.spellLevelRequirement = await driver
          .findElement(
            By.xpath(`//*[text()='${"Requires level"}']`)
          )
          .getAttribute("innerText");
      } catch (error) {
        console.log(error);
      }
      try {
        objToPush.spellWeaponRequirement = await driver
          .findElement(
            By.xpath(`//*[text()='${"Weapon"}']`)
          )
          .getAttribute("innerText");
      } catch (error) {
        console.log(error);
      }
      try {
        objToPush.spellDescription = await driver
          .findElement(
            By.xpath("/html/body/div[5]/div/div/div[2]/div[4]/div[3]/div[4]/table/tbody/tr[1]/td/table[2]/tbody/tr/td/div")
          )
          .getAttribute("innerText");
      } catch (error) {
        console.log(error);
      }

      console.log(objToPush);
      arrayOfScrapedData.push(objToPush);
      
    } catch (error) {
      console.log(error);
      arrayOfFailedSpellIDs.push(i);
      console.log(`No spell with id: ${i}`);
    }
  }
  console.log(arrayOfScrapedData);
  console.log(arrayOfFailedSpellIDs);

  return [arrayOfScrapedData, arrayOfFailedSpellIDs];
}

scrapeThenWriteToJSON();
