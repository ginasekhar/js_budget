const budgetController = (function () {
  

})();


// UI Controller
const UIController = (function () {
  const DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  };

  return {
    getInput : function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value:document.querySelector(DOMstrings.inputValue).value 
      }; 
    },

    getDOMstrings: function() {
      return DOMstrings;
    }
  }

})();

const controller = (function (budgetCtrl, UICtrl) {
  
  const setupEventListeners = function () {

    const DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    
      document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
          // when enter is pressed
          ctrlAddItem();
        }
      })

  }

  const ctrlAddItem = function() {
    // 1. Get field input data
        const input = UICtrl.getInput();
        
        console.log(input);
    
        // 2.  Add item to budget controller
        //3. Add item to UI
        //4. Calculate budget
        //5. Display budget on UI
    
  };

  return {
    init: function() {
      console.log("App has started");
      setupEventListeners();
    }
  }
    
})(budgetController, UIController);

controller.init();
