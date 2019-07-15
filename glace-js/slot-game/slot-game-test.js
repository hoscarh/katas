"use strict";

var Steps = require("./node_modules/glace-core").Steps;
var Page = require("./node_modules/glace-web").Page;
var taskPage = new Page(
    "Test Task", "file:///Users/oscar/Test_Task.html",
    { 
        testData: "input#testdata",
        spinButton: "input#spinButton",
        resultWinbox: "div#winbox",
        balanceValue: "input#balance-value",
    });

const combination = "111";
const combinationNotWin = "1";
var balance = 0;
var win = 0;

Steps.register({
    setText: async function (text) {
        await this.openPage(taskPage.name);
        await taskPage.testData.setText(text, { enter: true });
        await this.pause(1, "wait for result");
    },
});

suite("Test Task", [fxSeleniumServer], () => {

    test("Winner", () => {

        before(() => {
            $.webUrl = "file:///Users/oscar/Test_Task.html";
            $.registerPages(taskPage);
        });

        chunk("Get currente balance, set combinantion and Spin.", async () => {
            
            await $.openPage(taskPage.name);
            balance = await taskPage.balanceValue.getText();
            await taskPage.testData.setText(combination);
            await $.pause(1, "wait for click");
            await taskPage.spinButton.click();
            await $.pause(1, "wait for result");
        });

        chunk("Check Spin disabled", async () => {
            taskPage._addElement("spingDisable", "#spinButton disabled")
        });

        chunk("Add the PayTable element achievement and get value", async () => {
            taskPage._addElement("payTableWin", "tr.win"+ combination +".achievement td:nth-child(2)")
            win = await taskPage.payTableWin.getText();
        });

        chunk("Check new balance winner", async () => {
            var balance_result = await taskPage.balanceValue.getText();            
            expect((Number(balance) - 1) + Number(win) ).to.be.equal(Number(balance_result));
        });

        chunk("Check the winbox", async () => {
            expect(await taskPage.resultWinbox.getText()).to.be.equal("Win " + win + " coins");
        });

        chunk("Check blink elements", async () => {
            for (var i = 1; i <= combination.length; i++) {
                taskPage._addElement("reel" + i, "#reel" + i+ " div.notch.notch2.blinkme")
            }
 
        });

        chunk("Check hidden winbox", async () => {
            // TODO
        });

        chunk("Check not blink", async () => {
            // TODO
        });

        chunk("Check enable Spin", async () => {
            // TODO
        });

    });

    test("Not win", () => {

        chunk("Click Spin", async () => {
            await $.openPage(taskPage.name);
            balance = await taskPage.balanceValue.getText();
            await taskPage.testData.setText(combinationNotWin);
            await taskPage.spinButton.click();
        });

        chunk("Check new balance not winner", async () => {
            var balance_result = await taskPage.balanceValue.getText();            
            expect((Number(balance) - 1)).to.be.equal(Number(balance_result));
        });

        chunk("Check not winbox", async () => {
            // TODO
        });

        chunk("Check not blink", async () => {
            // TODO
        });

         chunk("Check not PayTable selected", async () => {
            // TODO
        });
     
    });

    test("Slot filled", () => {

        chunk("Click Spin", async () => {
            await $.openPage(taskPage.name);
            await taskPage.spinButton.click();
            await $.pause(1, "wait for result");
        });

        chunk("Check the values", async () => {
            for(var i = 1; i <= 5; i++){
                for(var j = 1; j <= 3; j++){
                    taskPage._addElement("reelF" + i, "#reel" + i + " div.notch.notch" + j );
                    var slotValue;
                    switch(i) {
                      case 1:
                        slotValue = await taskPage.reelF1.getText();
                        break;
                      case 2:
                        slotValue = await taskPage.reelF2.getText();
                        break;
                      case 3:
                        slotValue = await taskPage.reelF3.getText();
                        break;
                      case 4:
                        slotValue = await taskPage.reelF4.getText();
                        break;  
                      case 5:
                        slotValue = await taskPage.reelF5.getText();
                        break;  
                    }
                    taskPage.removeElements("reelF" + i);
                    expect(Number(slotValue)).to.be.greaterThan(0);
                    expect(Number(slotValue)).to.be.lessThan(6);
                }
            }
        });
    });

});