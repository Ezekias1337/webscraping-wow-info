const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");

async function parseSpellName(htmlToParse, arrayOfErrorMessages) {
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
    arrayOfErrorMessages.push(error.message);
    return null;
  }
}

async function parseRank(htmlToParse, arrayOfErrorMessages) {
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
    arrayOfErrorMessages.push(error.message);
    console.log("No rank for this spell");
    return null;
  }
}

async function parseTalent(htmlToParse, arrayOfErrorMessages) {
  try {
    const q0ElementList = await htmlToParse.findElements(By.className("q0"));

    for (let [index, item] of q0ElementList.entries()) {
      const itemToPushToObj = await item.getAttribute("innerHTML");

      if (itemToPushToObj.includes("Talent")) {
        return true;
      }
    }
  } catch (error) {
    arrayOfErrorMessages.push(error.message);
    console.log("No talent for this spell");
    return false;
  }
}

//This one gets called for a small amount of spells like 4741 which is a hunter pet spell
async function parseTertiaryRequirement(htmlToParse, arrayOfErrorMessages) {
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
    arrayOfErrorMessages.push(error.message);
    console.log("No talent for this spell");
    return false;
  }
}

async function parseSpellCost(htmlToParse, arrayOfErrorMessages) {
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
        } else if (itemToPushToObj.includes("\n")) {
          for (const itemNestedLoop of itemToPushToObj.split("\n")) {
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
              return itemNestedLoop;
            }
          }
        } else if (itemToPushToObj.length === 1) {
          return itemToPushToObj;
        }
      }
    }
  } catch (error) {
    arrayOfErrorMessages.push(error.message);
    console.log("No cost for this spell");
    return null;
  }
}

async function parseCastTime(htmlToParse, arrayOfErrorMessages) {
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
    arrayOfErrorMessages.push(error.message);
    console.log("No cast time for this spell");
    return null;
  }
}

async function parseToolsAndReagants(htmlToParse, arrayOfErrorMessages) {
  try {
    const q1ElementList = await htmlToParse.findElements(
      By.css("div.indent.q1")
    );
    const toolAndReagantArray = [];

    for (let [index, item] of q1ElementList.entries()) {
      const itemToPushToObj = await item.getAttribute("innerText");
      const toolsOrReagantRequirement = itemToPushToObj;
      toolAndReagantArray.push(toolsOrReagantRequirement);
    }
    return toolAndReagantArray;
  } catch (error) {
    arrayOfErrorMessages.push(error.message);
    console.log("No tool or reagant requirement for this spell");
    return false;
  }
}

async function parseRange(htmlToParse, arrayOfErrorMessages) {
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
    arrayOfErrorMessages.push(error.message);
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
    arrayOfErrorMessages.push(error.message);
    console.log("No spell range for this spell");
    return null;
  }
}

async function parseCD(htmlToParse, arrayOfErrorMessages) {
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
    arrayOfErrorMessages.push(error.message);
    console.log("No CD for this spell");
    return null;
  }
}

async function parseClassRequirement(driver, arrayOfErrorMessages) {
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
  } catch (error) {
    arrayOfErrorMessages.push(error.message);
  }

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
  } catch (error) {
    arrayOfErrorMessages.push(error.message);
  }
  return null;
}

async function parseLevelRequirement(htmlToParse, arrayOfErrorMessages) {
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
    arrayOfErrorMessages.push(error.message);
    console.log("No level requirement for this spell");
    return null;
  }
}

async function parseStanceOrFormRequirement(htmlToParse, arrayOfErrorMessages) {
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
    arrayOfErrorMessages.push(error.message);
    console.log("No level requirement for this spell");
    return null;
  }
}

async function parseWeaponRequirement(htmlToParse, arrayOfErrorMessages) {
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
    arrayOfErrorMessages.push(error.message);
    console.log("No weapon requirement for this spell");
    return null;
  }
}

async function parseItemSlotRequirement(htmlToParse, arrayOfErrorMessages) {
  try {
    const spanElementList = await htmlToParse.findElements(
      By.className("wowhead-tooltip-requirements")
    );

    for (let [index, item] of spanElementList.entries()) {
      const itemToPushToObj = await item.getAttribute("innerText");

      if (
        itemToPushToObj.includes("Requires Helms") ||
        itemToPushToObj.includes("Requires Shoulders") ||
        itemToPushToObj.includes("Requires Chest") ||
        itemToPushToObj.includes("Requires Bracers") ||
        itemToPushToObj.includes("Requires Gloves") ||
        itemToPushToObj.includes("Requires Pants") ||
        itemToPushToObj.includes("Requires Boots") ||
        itemToPushToObj.includes("Requires Cloak") ||
        itemToPushToObj.includes("Requires Armor")
      ) {
        const spellSlotRequirement = itemToPushToObj;
        return spellSlotRequirement;
      }
    }
  } catch (error) {
    arrayOfErrorMessages.push(error.message);
    console.log("No item slot requirement for this spell");
    return null;
  }
}

async function parseDescription(htmlToParse, arrayOfErrorMessages) {
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
    arrayOfErrorMessages.push(error.message);
    console.log("No description for this spell");
    return null;
  }
}

async function parseSpellIcon(htmlToParse, arrayOfErrorMessages) {
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
    arrayOfErrorMessages.push(error.message);
    console.log("No spell icon for this spell");
    return null;
  }
}

async function parseSpellScreenShot(htmlToParse, arrayOfErrorMessages) {
  try {
    const imageElement = await htmlToParse.findElements(By.css("img"));
    const imageElementBackgroundString = await imageElement[0].getAttribute(
      "src"
    );

    return imageElementBackgroundString;
  } catch (error) {
    arrayOfErrorMessages.push(error.message);
    console.log("No screenshot for this spell");
    return null;
  }
}

async function parseSpellComments(
  driver,
  commentTabToClick,
  arrayOfErrorMessages
) {
  //First click comment tab
  try {
    await commentTabToClick.click();
  } catch (error) {
    arrayOfErrorMessages.push(error.message);
    console.log("Failed to click comments tab");
    return null;
  }

  /* Second check for element which indicates there are no comments
  if this element is found, exit function */
  try {
    await driver.findElement(
      By.xpath("//b[contains(text(), 'No comments have been posted yet.')]")
    );
    console.log("Confirmed to have no comments");
    return null;
  } catch (error) {
    console.log("No comments element not found, now parsing comments");
  }

  //Now determine number of pages of comments
  let numberOfPagesToScrape;
  try {
    const qtyOfCommentsElementList = await driver.findElements(
      By.className("listview-nav")
    );
    const qtyOfCommentsElement = qtyOfCommentsElementList[3];

    if (qtyOfCommentsElement === undefined) {
      numberOfPagesToScrape = 1;
    } else {
      const commentParent = await qtyOfCommentsElement.findElements(
        By.css("span")
      );

      const commentQTYUnparsed = await commentParent[0].getAttribute(
        "innerText"
      );
      const commentQTYSplit = commentQTYUnparsed.split(" ");
      const rangeOfAllComments = parseInt(commentQTYSplit[4]);

      if (rangeOfAllComments <= 40) {
        numberOfPagesToScrape = 1;
      } else {
        numberOfPagesToScrape = Math.ceil(rangeOfAllComments / 40);
      }
    }
  } catch (error) {
    arrayOfErrorMessages.push(error.message);
    console.log("Failed to determine number of pages of comments");
    console.log(error.message, error);
  }

  //Now start looping through comments
  try {
    const arrayOfComments = [];

    for (let i = 0; i < numberOfPagesToScrape; i++) {
      const arrayOfCommentElements = await driver.findElements(
        By.className("comment")
      );

      for (const item of arrayOfCommentElements) {
        const arrayOfCommentsToPushToObj = {};
        try {
          //Get comment score
          const commentScoreParent = await item.findElements(
            By.css("p.rating")
          );
          const commentScore = await commentScoreParent[0].getAttribute(
            "innerText"
          );
          arrayOfCommentsToPushToObj.commentScore = commentScore;

          //Get comment author
          const commentAuthorParent = await item.findElements(
            By.css("td.comment-author")
          );
          const commentAuthor = await commentAuthorParent[0].getAttribute(
            "innerText"
          );
          arrayOfCommentsToPushToObj.commentAuthor = commentAuthor;

          //Get comment body
          const commentBodyParent = await item.findElements(
            By.css("div.comment-body")
          );
          const commentBody = await commentBodyParent[0].getAttribute(
            "innerText"
          );
          arrayOfCommentsToPushToObj.commentBody = commentBody;

          //Iterate through replies if they exist
          const repliesParent = await item.findElements(
            By.css("div.comment-replies")
          );

          if (repliesParent?.length > 0) {
            const arrayOfReplies = [];
            const arrayOfReplyRows = await repliesParent[0].findElements(
              By.css("tr.comment-reply-row")
            );

            for (const itemNested of arrayOfReplyRows) {
              const arrayOfRepliesToPushToObj = {};

              //Get Reply score
              const replyScoreParent = await itemNested.findElements(
                By.css("p.reply-rating")
              );
              const replyScore = await replyScoreParent[0].getAttribute(
                "innerText"
              );
              arrayOfRepliesToPushToObj.replyScore = replyScore;

              //Get HTML wrapper of reply author & body
              const replyAuthorAndBodyWrapper = await itemNested.findElements(
                By.css("td.reply-text")
              );

              //Get reply author
              const replyAuthorElement =
                await replyAuthorAndBodyWrapper[0].findElements(
                  By.css("p.comment-reply-author")
                );
              const replyAuthorString =
                await replyAuthorElement[0].getAttribute("innerText");
              arrayOfRepliesToPushToObj.replyAuthorString = replyAuthorString;

              //Get reply body
              const replyBodyElement =
                await replyAuthorAndBodyWrapper[0].findElements(
                  By.css("div.comment-reply-body")
                );
              const replyBodyString = await replyBodyElement[0].getAttribute(
                "innerText"
              );
              arrayOfRepliesToPushToObj.replyBodyString = replyBodyString;

              //Now that parsing is done, push it to array
              arrayOfReplies.push(arrayOfRepliesToPushToObj);
            }
            if (arrayOfReplies?.length !== 0) {
              arrayOfCommentsToPushToObj.replies = arrayOfReplies;
            }
          }
          arrayOfComments.push(arrayOfCommentsToPushToObj);
        } catch (error) {
          console.log(error.message, error);
          console.log("Failed comment scrape inside for of loop");
        }
      }
      console.log(`Done looping through page: ${i}`);

      /* Now click on the next pagination element to continue scraping
      Reason not reusing listview element from up top is because of stale
      element reference error */

      const listviewNavWrapper = await driver.findElements(
        By.css("div.listview-nav")
      );

      if (listviewNavWrapper[3] !== undefined) {
        const paginationElementList = await listviewNavWrapper[3].findElements(
          By.xpath("//a[contains(text(), 'Next ›')]")
        );

        const nextPageElement = paginationElementList[0];
        const nextPageElementDataActiveStatus =
          await nextPageElement.getAttribute("data-active");
        //This attribute determines if there are any other pages to scrape
        if (nextPageElementDataActiveStatus === "yes") {
          await nextPageElement.click();
          await driver.sleep(2000);
        }
      }
    }
    return arrayOfComments;
  } catch (error) {
    arrayOfErrorMessages.push(error.message);
    console.log(
      "Failed to loop through comments, the only comment needs moderator attention"
    );
    console.log(error);
    return null;
  }
}

async function parseToolTipInOrder(i, driver, arrayOfErrorMessages) {
  let objToPush = {};
  objToPush.ID = i;

  //This is the html for all the data except images/comments
  const toolTipTableParent = await driver.findElements(
    By.className("wowhead-tooltip")
  );
  const toolTipTable = toolTipTableParent[0];

  //This is the html for the spell icon
  const toolTipIconParent = await driver.findElements(By.id(`ic${i}`));
  const toolTipIcon = toolTipIconParent[0];

  //This is the html for the spell screenshot
  const screenShotParent = await driver.findElement(By.id("infobox-sticky-ss"));

  //This is the html for the spell comments
  const commentTabToClickFullArray = await driver.findElements(
    By.className("ugc-tab-comments")
  );
  const commentTabToClick = commentTabToClickFullArray[0];

  objToPush.spellName = await parseSpellName(
    toolTipTable,
    arrayOfErrorMessages
  );

  /*  If getting spellname fails, it means browser crashed, because every spell that exists
  has a name. So rebuild driver, wait, and then retry */

  if (objToPush.spellName === undefined || objToPush.spellName === null) {
    arrayOfErrorMessages.push(`Browser crashed, at index: ${i}.`);
    console.log("Browser crashed");
    driver = await new Builder().forBrowser("chrome").build();
    await driver.sleep(30000);
    console.log("Browser rebuilt");
    objToPush.spellName = await parseSpellName(
      toolTipTable,
      arrayOfErrorMessages
    );
  }

  objToPush.spellRank = await parseRank(toolTipTable, arrayOfErrorMessages);
  if (objToPush.spellRank === undefined || objToPush.spellRank === null) {
    delete objToPush.spellRank;
  }

  objToPush.isTalent = await parseTalent(toolTipTable, arrayOfErrorMessages);
  if (objToPush.isTalent === undefined || objToPush.isTalent === null) {
    objToPush.isTalent = false;
  }

  //Only check for tertiary requirement if ability is not a talent
  if (
    (objToPush && objToPush.isTalent === undefined) ||
    objToPush.isTalent === false
  ) {
    objToPush.tertiaryRequirement = await parseTertiaryRequirement(
      toolTipTable,
      arrayOfErrorMessages
    );
    if (
      objToPush.tertiaryRequirement === undefined ||
      objToPush.tertiaryRequirement === null ||
      objToPush.tertiaryRequirement === ""
    ) {
      delete objToPush.tertiaryRequirement;
    }
  }

  objToPush.spellCost = await parseSpellCost(
    toolTipTable,
    arrayOfErrorMessages
  );
  if (objToPush.spellCost === undefined || objToPush.spellCost === null) {
    delete objToPush.spellCost;
  }

  objToPush.spellCastTime = await parseCastTime(
    toolTipTable,
    arrayOfErrorMessages
  );
  if (
    objToPush.spellCastTime === undefined ||
    objToPush.spellCastTime === null
  ) {
    delete objToPush.spellCastTime;
  }

  const toolsAndReagantArray = await parseToolsAndReagants(
    toolTipTable,
    arrayOfErrorMessages
  );

  objToPush.tools = toolsAndReagantArray[0];
  if (objToPush.tools === undefined || objToPush.tools === null) {
    delete objToPush.tools;
  }

  objToPush.reagents = toolsAndReagantArray[1];
  if (objToPush.reagents === undefined || objToPush.reagents === null) {
    delete objToPush.reagents;
  }

  objToPush.spellRange = await parseRange(toolTipTable, arrayOfErrorMessages);
  if (objToPush.spellRange === undefined || objToPush.spellRange === null) {
    delete objToPush.spellRange;
  }

  objToPush.spellCD = await parseCD(toolTipTable, arrayOfErrorMessages);
  if (objToPush.spellCD === undefined || objToPush.spellCD === null) {
    delete objToPush.spellCD;
  }

  objToPush.classRequirement = await parseClassRequirement(
    driver,
    arrayOfErrorMessages
  );
  if (
    objToPush.classRequirement === undefined ||
    objToPush.classRequirement === null
  ) {
    delete objToPush.classRequirement;
  }

  objToPush.levelRequirement = await parseLevelRequirement(
    toolTipTable,
    arrayOfErrorMessages
  );
  if (
    objToPush.levelRequirement === undefined ||
    objToPush.levelRequirement === null
  ) {
    delete objToPush.levelRequirement;
  }

  objToPush.stanceOrFormRequirement = await parseStanceOrFormRequirement(
    toolTipTable,
    arrayOfErrorMessages
  );
  if (
    objToPush.stanceOrFormRequirement === undefined ||
    objToPush.stanceOrFormRequirement === null
  ) {
    delete objToPush.stanceOrFormRequirement;
  }

  objToPush.weaponRequirement = await parseWeaponRequirement(
    toolTipTable,
    arrayOfErrorMessages
  );
  if (
    objToPush.weaponRequirement === undefined ||
    objToPush.weaponRequirement === null
  ) {
    delete objToPush.weaponRequirement;
  }

  objToPush.itemSlotRequirement = await parseItemSlotRequirement(
    toolTipTable,
    arrayOfErrorMessages
  );
  if (
    objToPush.itemSlotRequirement === undefined ||
    objToPush.itemSlotRequirement === null
  ) {
    delete objToPush.itemSlotRequirement;
  }

  objToPush.description = await parseDescription(
    toolTipTable,
    arrayOfErrorMessages
  );
  if (objToPush.description === undefined || objToPush.description === null) {
    delete objToPush.description;
  }

  objToPush.spellIconURL = await parseSpellIcon(
    toolTipIcon,
    arrayOfErrorMessages
  );
  if (objToPush.spellIconURL === undefined || objToPush.spellIconURL === null) {
    delete objToPush.spellIconURL;
  }

  objToPush.screenShotURL = await parseSpellScreenShot(
    screenShotParent,
    arrayOfErrorMessages
  );
  if (
    objToPush.screenShotURL === undefined ||
    objToPush.screenShotURL === null
  ) {
    delete objToPush.screenShotURL;
  }

  objToPush.comments = await parseSpellComments(
    driver,
    commentTabToClick,
    arrayOfErrorMessages
  );
  if (
    objToPush.comments === undefined ||
    objToPush.comments === null ||
    objToPush.comments.length === 0
  ) {
    delete objToPush.comments;
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
    fs.writeFileSync("./spells/successfulScrapeResults.json", dataComplete);
  }
  if (dataFailed.length > 0) {
    fs.writeFileSync("./spells/unsuccessfulScrapeResults.json", dataFailed);
  }
  if (dataPotentiallySkipped.length > 0) {
    fs.writeFileSync(
      "./spells/potentiallySkippedResults.json",
      dataPotentiallySkipped
    );
  }
  if (errorMessageArray !== "[]") {
    fs.writeFileSync("./spells/errorMessageLogs.json", errorMessageArray);
  }

  await driver.close();
}

async function scrapeSpellInfo() {
  let driver = await new Builder().forBrowser("chrome").build();
  let arrayOfScrapedData = [];
  let arrayOfFailedSpellIDs = [];
  let arrayOfPotentiallySkippedIDs = [];
  let arrayOfErrorMessages = [];

  for (let i = 0; i < 52120; i++) {
    let continueCodeExecution = false;

    /* 
      Check for elements which indicate internet disconnected, if found then pause
      code
    */

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
        const dataToPushToArray = await parseToolTipInOrder(
          i,
          driver,
          arrayOfErrorMessages
        );
        arrayOfScrapedData.push(dataToPushToArray);
      } catch (error) {
        arrayOfPotentiallySkippedIDs.push(i);
        arrayOfErrorMessages.push([i, error.message]);
        console.log(`Spell ID: ${i}, Failed to scrape data!`);
        console.log(
          "Sleeping for: 5 Minutes. This is in order to wait for internet to come back."
        );
        arrayOfErrorMessages.push(`No internet, at index: ${i}.`);
        driver = await new Builder().forBrowser("chrome").build();
        await driver.sleep(30000);
        console.log("Internet should be back by now, resuming");
        await driver.get(`https://tbc.wowhead.com/spell=${i}`);

        try {
          const dataToPushToArray = await parseToolTipInOrder(
            i,
            driver,
            arrayOfErrorMessages
          );
          arrayOfScrapedData.push(dataToPushToArray);
        } catch (error) {
          arrayOfErrorMessages.push([i, error.message]);
          console.log("failed to continue after internet returned");
        }
      }
    }
  }

  return [
    arrayOfScrapedData,
    arrayOfFailedSpellIDs,
    arrayOfPotentiallySkippedIDs,
    driver,
    arrayOfErrorMessages,
  ];
}

scrapeThenWriteToJSON();
