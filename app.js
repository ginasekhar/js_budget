const budgetController = (function () {
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  let data = {
    allItems : {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function(type, des, val) {
      let newItem, ID; 
      
      // ID = lastID + 1
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //create new item based on type (inc or exp and push on appropriate array)
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }
console.log('New Item is ', newItem, type);
      data.allItems[type].push(newItem);
      console.log(data.allItems);
      return newItem;
    },

    testing : function() {
      console.log(data);
    }
  }

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
    let input, newItem;
    // 1. Get field input data
        input = UICtrl.getInput();
        console.log(input);
        
        // 2.  Add item to budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value)
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
