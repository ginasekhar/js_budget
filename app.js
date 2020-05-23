const budgetController = (function () {
  

})();


// UI Controller
const UIController = (function () {

  

})();

const controller = (function (budgetCtrl, UICtrl) {

  const ctrlAddItem = function() {
    // 1. Get field input data
        const input = UICtrl.getInput();
        
        console.log(input);
    
        // 2.  Add item to budget controller
        //3. Add item to UI
        //4. Calculate budget
        //5. Display budget on UI
    
      }
    
      document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    
      document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
          // when enter is pressed
          ctrlAddItem();
        }
      })

})(budgetController, UIController);
