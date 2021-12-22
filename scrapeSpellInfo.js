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
        let rankStrSliced = itemToPushToObj.slice(0, 6);
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

//This one gets called for a small amount of spells like 4741 which is a hunter pet spell
async function parseTertiaryRequirement(htmlToParse) {
  try {
    const q0ElementList = await htmlToParse.findElements(By.css("b.q0"));

    for (let [index, item] of q0ElementList.entries()) {
      const itemToPushToObj = await item.getAttribute("innerText");
      const tertiaryRequirement = itemToPushToObj;

      if (
        !(
          tertiaryRequirement.includes("Rank") ||
          tertiaryRequirement.includes("Talent") ||
          tertiaryRequirement.includes("Level")
        )
      ) {
        return tertiaryRequirement;
      } else if (tertiaryRequirement.includes("\n")) {
        for (const itemNested of tertiaryRequirement.split("\n")) {
          if (
            !(
              itemNested.includes("Rank") ||
              itemNested.includes("Talent") ||
              itemNested.includes("Level")
            )
          ) {
            return itemNested;
          }
        }
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
      const itemToPushToObj = await item.getAttribute("innerText");
      if (
        itemToPushToObj.includes("Energy") ||
        itemToPushToObj.includes("energy") ||
        itemToPushToObj.includes("Rage") ||
        itemToPushToObj.includes("rage") ||
        itemToPushToObj.includes("Focus") ||
        itemToPushToObj.includes("focus") ||
        itemToPushToObj.includes("Mana") ||
        itemToPushToObj.includes("mana")
      ) {
        if (itemToPushToObj.includes("\t")) {
          for (const itemNestedLoop of itemToPushToObj.split("\t")) {
            if (
              itemNestedLoop.includes("Energy") ||
              itemNestedLoop.includes("energy") ||
              itemNestedLoop.includes("Rage") ||
              itemNestedLoop.includes("rage") ||
              itemNestedLoop.includes("Focus") ||
              itemNestedLoop.includes("focus") ||
              itemNestedLoop.includes("Mana") ||
              itemNestedLoop.includes("mana")
            ) {
              if (itemNestedLoop.includes("\n")) {
                for (const itemNestedNestedLoop of itemNestedLoop.split("\n")) {
                  if (
                    itemNestedNestedLoop.includes("Energy") ||
                    itemNestedNestedLoop.includes("energy") ||
                    itemNestedNestedLoop.includes("Rage") ||
                    itemNestedNestedLoop.includes("rage") ||
                    itemNestedNestedLoop.includes("Focus") ||
                    itemNestedNestedLoop.includes("focus") ||
                    itemNestedNestedLoop.includes("Mana") ||
                    itemNestedNestedLoop.includes("mana")
                  ) {
                    return itemNestedNestedLoop;
                  }
                }
              }
              return itemNestedLoop;
            }
          }
        } else if (itemToPushToObj.length === 1) {
          return itemToPushToObj;
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

async function parseReagents(htmlToParse) {
  try {
    const q1ElementList = await htmlToParse.findElements(By.css("div.q1"));

    for (let [index, item] of q1ElementList.entries()) {
      const itemToPushToObj = await item.getAttribute("innerText");
      const reagentsRequirement = itemToPushToObj;

      return reagentsRequirement;
    }
  } catch (error) {
    console.log("No talent for this spell");
    return false;
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
    console.log("Possibly no range for this spell, trying td element next");
    return null;
  }
  //Some tooltips ranges are in a td instead of th, this will find it
  try {
    const tdElementList = await htmlToParse.findElements(By.css("td"));

    for (let [index, item] of tdElementList.entries()) {
      const itemToPushToObj = await item.getAttribute("innerText");

      if (
        itemToPushToObj.includes("Melee Range") ||
        itemToPushToObj.includes("yd range") ||
        itemToPushToObj.includes("Unlimited range")
      ) {
        if (itemToPushToObj.includes("\n")) {
          const itemToPushToObjSplit = itemToPushToObj.split("\n");

          for (const itemNested of itemToPushToObjSplit) {
            if (
              itemNested.includes("Melee Range") ||
              itemNested.includes("yd range") ||
              itemNested.includes("Unlimited range")
            ) {
              const spellRange = itemNested;
              return spellRange;
            }
          }
        }

        const spellRange = itemToPushToObj;
        return spellRange;
      }
    }
  } catch (error) {
    console.log("No spell range for this spell");
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

async function parseStanceOrFormRequirement(htmlToParse) {
  try {
    const thElementList = await htmlToParse.findElements(
      By.className("wowhead-tooltip-requirements")
    );

    for (let [index, item] of thElementList.entries()) {
      const itemToPushToObj = await item.getAttribute("innerHTML");

      if (
        itemToPushToObj.includes("Form") ||
        itemToPushToObj.includes("Stance")
      ) {
        const stanceOrFormRequirement = itemToPushToObj;
        return stanceOrFormRequirement;
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
        (spellDescription.includes("<!--") ||
          spellDescription.includes("-->") ||
          spellDescription.includes("<span") ||
          spellDescription.includes(">[(") ||
          spellDescription.includes("<br") ||
          spellDescription.includes("<") ||
          spellDescription.includes(">")) &&
        !spellDescription.includes("Item Level")
      ) {
        const spellDescriptionHTMLRemoved = await item.getAttribute(
          "innerText"
        );
        const parsedString = spellDescriptionHTMLRemoved.replace(/\n/g, " ");
        const parsedStringNoDoubleSpace = parsedString.replace(/ /g, "");
        //If description has a leading space, the trim removes it
        return parsedStringNoDoubleSpace.trim();
      } else {
        //Script was pulling crafted item level as description, this fixes it
        if (!spellDescription.includes("Item Level")) {
          return spellDescription;
        } else {
          return null;
        }
      }
    }
  } catch (error) {
    console.log("No description for this spell");
    return null;
  }
}

async function parseSpellIcon(htmlToParse) {
  try {
    const imageElement = await htmlToParse.findElements(
      By.className("iconlarge")
    );

    const imageElementBackground = await imageElement[0].findElements(
      By.css("ins")
    );

    const imageElementBackgroundString =
      await imageElementBackground[0].getCssValue("backgroundImage");

    const backgroundStringTrimmed = imageElementBackgroundString
      .replace('url("', "")
      .replace('")', "");

    return backgroundStringTrimmed;
  } catch (error) {
    console.log("No spell icon for this spell");
    return null;
  }
}

async function parseSpellScreenShot(htmlToParse) {
  try {
    const imageElement = await htmlToParse.findElements(By.css("img"));

    console.log(imageElement[0]);

    const imageElementBackgroundString = await imageElement[0].getAttribute(
      "src"
    );
    console.log(imageElementBackgroundString);

    return imageElementBackgroundString;
  } catch (error) {
    console.log("No screenshot for this spell");
    return null;
  }
}

async function parseToolTipInOrder(i, driver) {
  let objToPush = {};
  objToPush.ID = i;

  //This is the html for all the data except images
  const toolTipTableParent = await driver.findElements(
    By.className("wowhead-tooltip")
  );
  const toolTipTable = toolTipTableParent[0];

  //This is the html for the spell icon
  const toolTipIconParent = await driver.findElements(By.id(`ic${i}`));
  const toolTipIcon = toolTipIconParent[0];

  //This is the html for the spell screenshot
  const screenShotParent = await driver.findElement(By.id("infobox-sticky-ss"));

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

  //Only check for tertiary requirement if ability is not a talent
  if (
    (objToPush && objToPush.isTalent === undefined) ||
    objToPush.isTalent === false
  ) {
    objToPush.tertiaryRequirement = await parseTertiaryRequirement(
      toolTipTable
    );
    if (
      objToPush.tertiaryRequirement === undefined ||
      objToPush.tertiaryRequirement === null ||
      objToPush.tertiaryRequirement === ""
    ) {
      delete objToPush.tertiaryRequirement;
    }
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

  objToPush.reagents = await parseReagents(toolTipTable);
  if (objToPush.reagents === undefined || objToPush.reagents === null) {
    delete objToPush.reagents;
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

  objToPush.stanceOrFormRequirement = await parseStanceOrFormRequirement(
    toolTipTable
  );
  if (
    objToPush.stanceOrFormRequirement === undefined ||
    objToPush.stanceOrFormRequirement === null
  ) {
    delete objToPush.stanceOrFormRequirement;
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

  objToPush.spellIconURL = await parseSpellIcon(toolTipIcon);
  if (objToPush.spellIconURL === undefined || objToPush.spellIconURL === null) {
    delete objToPush.spellIconURL;
  }

  objToPush.screenShotURL = await parseSpellScreenShot(screenShotParent);
  if (
    objToPush.screenShotURL === undefined ||
    objToPush.screenShotURL === null
  ) {
    delete objToPush.screenShotURL;
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
  let errorMessageArray = JSON.stringify(resultOfScrape[4]);

  if (dataComplete.length > 0) {
    fs.writeFileSync("successfulScrapeResults.json", dataComplete);
  }
  if (dataFailed.length > 0) {
    fs.writeFileSync("unsuccessfulScrapeResults.json", dataFailed);
  }
  if (dataPotentiallySkipped.length > 0) {
    fs.writeFileSync("potentiallySkippedResults.json", dataPotentiallySkipped);
  }
  if (errorMessageArray !== "[]") {
    fs.writeFileSync("errorMessageLogs.json", errorMessageArray);
  }

  await driver.close();
}

async function scrapeSpellInfo() {
  let driver = await new Builder().forBrowser("chrome").build();
  let arrayOfScrapedData = [];
  let arrayOfFailedSpellIDs = [];
  let arrayOfPotentiallySkippedIDs = [];
  let arrayOfErrorMessages = [];

  //for (let i = 46748; i < 52120; i++) {
  for (let i = 27019; i < 27020; i++) {
    let continueCodeExecution = false;

    /* check for element with warning stating that id doesn't exist in db
    if try statement is successful, element doesn't exist in db */
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
    }

    /* this only executes if the notFoundElement was failed to be found in DOM,
    meaning id exists */
    if (continueCodeExecution === true) {
      try {
        const dataToPushToArray = await parseToolTipInOrder(i, driver);
        arrayOfScrapedData.push(dataToPushToArray);
      } catch (error) {
        arrayOfPotentiallySkippedIDs.push(i);
        arrayOfErrorMessages.push([i, error.message]);
        console.log(`Spell ID: ${i}, Failed to scrape data!`);
      }
    }
  }

  console.log(
    arrayOfScrapedData,
    arrayOfFailedSpellIDs,
    arrayOfPotentiallySkippedIDs,
    arrayOfErrorMessages
  );

  return [
    arrayOfScrapedData,
    arrayOfFailedSpellIDs,
    arrayOfPotentiallySkippedIDs,
    driver,
    arrayOfErrorMessages,
  ];
}

scrapeThenWriteToJSON();
