const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");

async function parseSpellName(htmlToParse) {
  try {
    const whttNameElementList = await htmlToParse.findElements(
      By.className("whtt-name")
    );

    for (let [index, item] of whttNameElementList.entries()) {
      const itemToPushToObj = await item.getAttribute("innerHTML");

      if (!itemToPushToObj.includes("<b")) {
        const spellName = itemToPushToObj;
        return spellName;
      }
    }
  } catch (error) {
    return null;
  }
}

async function parseRank(htmlToParse) {
  try {
    const q0ElementList = await htmlToParse.findElements(By.className("q0"));

    for (let [index, item] of q0ElementList.entries()) {
      const itemToPushToObj = await item.getAttribute("innerHTML");

      if (itemToPushToObj.includes("Rank")) {
        let rankStrSliced = objToPush.rank.slice(0, 6);
        const spellRank = rankStrSliced;
        return spellRank;
      }
    }
  } catch (error) {
    console.log("No rank for this spell");
    return null;
  }
}

async function parseTalent(htmlToParse) {
  try {
    const q0ElementList = await htmlToParse.findElements(By.className("q0"));

    for (let [index, item] of q0ElementList.entries()) {
      const itemToPushToObj = await item.getAttribute("innerHTML");

      if (itemToPushToObj.includes("Talent")) {
        return true;
      }
    }
  } catch (error) {
    console.log("No talent for this spell");
    return false;
  }
}

async function parseSpellCost(htmlToParse) {
  try {
    const tdElementList = await htmlToParse.findElements(By.css("td"));
    for (let [index, item] of tdElementList.entries()) {
      const itemToPushToObj = await item.getAttribute("innerHTML");
      if (
        itemToPushToObj.includes("Energy") ||
        itemToPushToObj.includes("Rage") ||
        itemToPushToObj.includes("Focus") ||
        itemToPushToObj.includes("Mana")
      ) {
        if (
          itemToPushToObj.includes("<br>") ||
          itemToPushToObj.includes("<table") ||
          itemToPushToObj.includes("<div") ||
          itemToPushToObj.includes("<a") ||
          itemToPushToObj.includes("<b")
        ) {
          const refinedItemToPushToObjStringToSplit = await item.getAttribute(
            "innerText"
          );
          const itemStringSplit =
            refinedItemToPushToObjStringToSplit.split("\n");
          //Removed first item from array, because it's unneeded
          itemStringSplit.shift();
          for (const individualElement of itemStringSplit) {
            if (
              individualElement.includes("Energy") ||
              individualElement.includes("energy") ||
              individualElement.includes("Rage") ||
              individualElement.includes("rage") ||
              individualElement.includes("Focus") ||
              individualElement.includes("focus") ||
              individualElement.includes("Mana") ||
              individualElement.includes("mana")
            ) {
              if (individualElement.includes("\t")) {
                for (const individualElementSplitToArray of individualElement.split(
                  "\t"
                )) {
                  if (
                    individualElementSplitToArray.includes("Energy") ||
                    individualElementSplitToArray.includes("Rage") ||
                    individualElementSplitToArray.includes("Focus") ||
                    individualElementSplitToArray.includes("Mana")
                  ) {
                    return individualElementSplitToArray;
                  }
                }
              } else {
                return individualElement;
              }
            }
          }

          return itemStringSplit;
        } else {
          const spellCost = itemToPushToObj;
          return spellCost;
        }
      }
    }
  } catch (error) {
    console.log("No cost for this spell");
    return null;
  }
}

async function parseCastTime(htmlToParse) {
  try {
    const tdElementList = await htmlToParse.findElements(By.css("td"));
    for (let [index, item] of tdElementList.entries()) {
      const itemToPushToObj = await item.getAttribute("innerHTML");

      if (
        itemToPushToObj.includes("Instant") ||
        itemToPushToObj.includes("sec cast") ||
        itemToPushToObj.includes(" cast)")
      ) {
        if (
          itemToPushToObj.includes("<br>") ||
          itemToPushToObj.includes("<table") ||
          itemToPushToObj.includes("<div") ||
          itemToPushToObj.includes("<a") ||
          itemToPushToObj.includes("<b")
        ) {
          const refinedItemToPushToObjStringToSplit = await item.getAttribute(
            "innerText"
          );
          const itemStringSplitToArray =
            refinedItemToPushToObjStringToSplit.split("\n");
          //Removed first item from array, because it's unneeded
          itemStringSplitToArray.shift();
          for (const [
            index,
            arrayElement,
          ] of itemStringSplitToArray.entries()) {
            if (
              arrayElement.includes("Instant") ||
              arrayElement.includes("sec cast") ||
              (arrayElement.includes(" cast)") &&
                !(
                  arrayElement.includes("Energy") ||
                  arrayElement.includes("Rage") ||
                  arrayElement.includes("Focus") ||
                  arrayElement.includes("Mana")
                ))
            ) {
              if (arrayElement.includes("\t")) {
                let refinedArray = arrayElement.split("\t");
                for (const stringIndex of refinedArray) {
                  if (
                    stringIndex.includes("Instant") ||
                    stringIndex.includes("sec cast") ||
                    stringIndex.includes(" cast")
                  ) {
                    return stringIndex;
                  }
                }
              } else {
                return arrayElement;
              }
            }
          }
        } else {
          spellCastTime = itemToPushToObj;
          return spellCastTime;
        }
      }
    }
  } catch (error) {
    console.log("No cast time for this spell");
    return null;
  }
}

async function parseRange(htmlToParse) {
  try {
    const thElementList = await htmlToParse.findElements(By.css("th"));

    for (let [index, item] of thElementList.entries()) {
      const itemToPushToObj = await item.getAttribute("innerHTML");

      if (
        itemToPushToObj.includes("Melee Range") ||
        itemToPushToObj.includes("yd range") ||
        itemToPushToObj.includes("Unlimited range")
      ) {
        const spellRange = itemToPushToObj;
        return spellRange;
      }
    }
  } catch (error) {
    console.log("No range for this spell");
    return null;
  }
}

async function parseCD(htmlToParse) {
  try {
    const thElementList = await htmlToParse.findElements(By.css("th"));

    for (let [index, item] of thElementList.entries()) {
      const itemToPushToObj = await item.getAttribute("innerHTML");

      if (itemToPushToObj.includes("sec cooldown")) {
        const spellCD = itemToPushToObj;
        return spellCD;
      }
    }
  } catch (error) {
    console.log("No CD for this spell");
    return null;
  }
}

async function parseClassRequirement(driver) {
  try {
    const infoBoxContents = await driver.findElements(
      By.className("infobox-inner-table")
    );
    const elementWithPotentialClassRequirements =
      await infoBoxContents[0].findElement(
        By.xpath("//div[contains(text(), 'Classes:')]")
      );
    const elementWithPotentialClassRequirementsInnerText =
      await elementWithPotentialClassRequirements.getAttribute("innerText");
    //Removes escape character if it's present in string
    const parsedString = elementWithPotentialClassRequirementsInnerText.replace(
      /\n/g,
      ""
    );
    const parsedStringNoDoubleSpace = parsedString.replace(/  /g, " ");
    return parsedStringNoDoubleSpace;
  } catch (error) {}

  //If spell has only one class requirement, need to search by alternate xpath
  try {
    const infoBoxContents = await driver.findElements(
      By.className("infobox-inner-table")
    );
    const elementWithPotentialClassRequirements =
      await infoBoxContents[0].findElement(
        By.xpath("//div[contains(text(), 'Class:')]")
      );
    const elementWithPotentialClassRequirementsInnerText =
      await elementWithPotentialClassRequirements.getAttribute("innerText");
    //Removes escape character if it's present in string
    const parsedString = elementWithPotentialClassRequirementsInnerText.replace(
      /\n/g,
      ""
    );
    const parsedStringNoDoubleSpace = parsedString.replace(/  /g, " ");
    return parsedStringNoDoubleSpace;
  } catch (error) {}
  return null;
}

async function parseLevelRequirement(htmlToParse) {
  try {
    const thElementList = await htmlToParse.findElements(
      By.className("wowhead-tooltip-requirements")
    );

    for (let [index, item] of thElementList.entries()) {
      const itemToPushToObj = await item.getAttribute("innerHTML");

      if (itemToPushToObj.includes("Requires level")) {
        const spellLevelRequirement = itemToPushToObj;
        return spellLevelRequirement;
      }
    }
  } catch (error) {
    console.log("No level requirement for this spell");
    return null;
  }
}

async function parseWeaponRequirement(htmlToParse) {
  try {
    const thElementList = await htmlToParse.findElements(
      By.className("wowhead-tooltip-requirements")
    );

    for (let [index, item] of thElementList.entries()) {
      const itemToPushToObj = await item.getAttribute("innerHTML");

      if (
        itemToPushToObj.includes("Requires Ranged Weapon") ||
        itemToPushToObj.includes("Requires Melee Weapon") ||
        itemToPushToObj.includes("Requires Wand")
      ) {
        const spellWeaponRequirement = itemToPushToObj;
        return spellWeaponRequirement;
      }
    }
  } catch (error) {
    console.log("No weapon requirement for this spell");
    return null;
  }
}

async function parseDescription(htmlToParse) {
  try {
    const spellDescriptionElementList = await htmlToParse.findElements(
      By.className("q")
    );

    for (let [index, item] of spellDescriptionElementList.entries()) {
      const spellDescription = await item.getAttribute("innerHTML");
      if (
        spellDescription.includes("&nbsp;") ||
        spellDescription.includes("<!--") ||
        spellDescription.includes("-->") ||
        spellDescription.includes("<span") ||
        spellDescription.includes(">[(")
      ) {
        const spellDescriptionHTMLRemoved = await item.getAttribute(
          "innerText"
        );
        const parsedString = spellDescriptionHTMLRemoved.replace(/\n/g, " ");
        const parsedStringNoDoubleSpace = parsedString.replace(/ /g, "");

        return parsedStringNoDoubleSpace;
      } else {
        return spellDescription;
      }
    }
  } catch (error) {
    console.log("No description for this spell");
    return null;
  }
}

async function parseToolTipInOrder(i, driver) {
  let objToPush = {};
  objToPush.ID = i;

  const toolTipTableParent = await driver.findElements(
    By.className("wowhead-tooltip")
  );
  const toolTipTable = toolTipTableParent[0];

  objToPush.spellName = await parseSpellName(toolTipTable);
  if (objToPush.spellName === undefined || objToPush.spellName === null) {
    delete objToPush.spellName;
  }

  objToPush.spellRank = await parseRank(toolTipTable);
  if (objToPush.spellRank === undefined || objToPush.spellRank === null) {
    delete objToPush.spellRank;
  }

  objToPush.isTalent = await parseTalent(toolTipTable);
  if (objToPush.isTalent === undefined || objToPush.isTalent === null) {
    objToPush.isTalent = false;
  }

  objToPush.spellCost = await parseSpellCost(toolTipTable);
  if (objToPush.spellCost === undefined || objToPush.spellCost === null) {
    delete objToPush.spellCost;
  }

  objToPush.spellCastTime = await parseCastTime(toolTipTable);
  if (
    objToPush.spellCastTime === undefined ||
    objToPush.spellCastTime === null
  ) {
    delete objToPush.spellCastTime;
  }

  objToPush.spellRange = await parseRange(toolTipTable);
  if (objToPush.spellRange === undefined || objToPush.spellRange === null) {
    delete objToPush.spellRange;
  }

  objToPush.spellCD = await parseCD(toolTipTable);
  if (objToPush.spellCD === undefined || objToPush.spellCD === null) {
    delete objToPush.spellCD;
  }

  objToPush.classRequirement = await parseClassRequirement(driver);
  if (
    objToPush.classRequirement === undefined ||
    objToPush.classRequirement === null
  ) {
    delete objToPush.classRequirement;
  }

  objToPush.levelRequirement = await parseLevelRequirement(toolTipTable);
  if (
    objToPush.levelRequirement === undefined ||
    objToPush.levelRequirement === null
  ) {
    delete objToPush.levelRequirement;
  }

  objToPush.weaponRequirement = await parseWeaponRequirement(toolTipTable);
  if (
    objToPush.weaponRequirement === undefined ||
    objToPush.weaponRequirement === null
  ) {
    delete objToPush.weaponRequirement;
  }

  objToPush.description = await parseDescription(toolTipTable);
  if (objToPush.description === undefined || objToPush.description === null) {
    delete objToPush.description;
  }
  console.log(
    "----------------------------------------------------------------------"
  );
  console.log(objToPush);
  console.log(
    "----------------------------------------------------------------------"
  );
  return objToPush;
}

async function scrapeThenWriteToJSON() {
  let resultOfScrape = await scrapeSpellInfo();
  let dataComplete = JSON.stringify(resultOfScrape[0]);
  let dataFailed = JSON.stringify(resultOfScrape[1]);
  let dataPotentiallySkipped = JSON.stringify(resultOfScrape[2]);
  let driver = resultOfScrape[3];

  fs.writeFileSync("successfulScrapeResults.json", dataComplete);
  fs.writeFileSync("unsuccessfulScrapeResults.json", dataFailed);
  fs.writeFileSync("potentiallySkippedResults.json", dataPotentiallySkipped);
  await driver.close();
}

async function scrapeSpellInfo() {
  let driver = await new Builder().forBrowser("chrome").build();
  let arrayOfScrapedData = [];
  let arrayOfFailedSpellIDs = [];
  let arrayOfPotentiallySkippedIDs = [];

  //for (let i = 0; i < 45000; i++) {
  for (let i = 1; i < 250; i++) {
    let continueCodeExecution = false;

    //check for element with warning stating that id doesn't exist in db
    //if try statement is successful, element doesn't exist in db
    try {
      await driver.get(`https://tbc.wowhead.com/spell=${i}`);
      const notFoundElement = await driver.findElement(
        By.xpath(
          "//div[contains(text(), 'It may have been removed from the game.')]"
        )
      );
      arrayOfFailedSpellIDs.push(i);
      console.log(`Spell ID: ${i}, confirmed to not exist`);
    } catch (error) {
      //if in this catch statement, couldn't find the element, meaning id exists
      continueCodeExecution = true;
      console.log(`Spell ID: ${i} did not find notFoundElement.`);
    }

    //this only executes if the notFoundElement was failed to be found in DOM
    if (continueCodeExecution === true) {
      try {
        const dataToPushToArray = await parseToolTipInOrder(i, driver);
        arrayOfScrapedData.push(dataToPushToArray);
      } catch (error) {
        arrayOfPotentiallySkippedIDs.push(i);
        console.log(`Spell ID: ${i}, Failed to scrape data!`);
      }
    }
  }

  console.log(
    arrayOfScrapedData,
    arrayOfFailedSpellIDs,
    arrayOfPotentiallySkippedIDs
  );

  return [
    arrayOfScrapedData,
    arrayOfFailedSpellIDs,
    arrayOfPotentiallySkippedIDs,
    driver
  ];
}

scrapeThenWriteToJSON();