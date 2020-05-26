const balanceController = (function () {
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

  const calculateTotal = function(type) {
    let sum = 0;
    data.allItems[type].forEach(function(cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  }

  let data = {
    allItems : {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    balance: 0,
    percentage: -1
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

      data.allItems[type].push(newItem);
      
      return newItem;
    },

    deleteItem: function(type, id) {
      
      let ids, index;
      
      ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index,1);
      }

    },

    calculateBalance : function() {
      //calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      //calculate balance (income - expense)
      data.balance = data.totals.inc - data.totals.exp;

      //calculate expense as percent of income
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    getBalance : function() {
      return {
        balance: data.balance,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage : data.percentage
      }
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
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    balanceLabel : '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentage: '.budget__expenses--percentage',
    container: '.container'
  };

  return {
    getInput : function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      }; 
    },

    addListItem: function(obj, type) {

      let html, newHtml, element;
      // Create html string with placeholder text

      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      } else if (type === 'exp'){
        element = DOMstrings.expensesContainer;
        html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">10%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div> </div>'
      };

      //replace place holder with data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      //insert html into DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem: function(selectorID) {
      let element = document.getElementById(selectorID);
      element.parentNode.removeChild(element);
    },

    clearFields: function() {
      let fields, fieldsArray;
        fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

        fieldsArray = Array.prototype.slice.call(fields);
        fieldsArray.forEach(function (current, index, array) { 
          current.value = "";
        })
        fieldsArray[0].focus();
    },

    displayBalance : function(obj) {
      document.querySelector(DOMstrings.balanceLabel).textContent = obj.balance ;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc ;
      document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp ;
      
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentage).textContent = obj.percentage + '%';

      } else {
        document.querySelector(DOMstrings.percentage).textContent = '---'
      }


    },

    getDOMstrings: function() {
      return DOMstrings;
    }
  }

})();

const controller = (function (balanceCtrl, UICtrl) {
  
  const setupEventListeners = function () {

    const DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    
      document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
          // when enter is pressed
          ctrlAddItem();
        }
      });

      document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)

  }
  const updateBalance = function() {
    //5. Calculate balance
    balanceCtrl.calculateBalance();

    //2. Return the balance
    let balance = balanceCtrl.getBalance();

    //6. Display balance on UI
    UICtrl.displayBalance(balance);
  }

  const ctrlAddItem = function() {
    let input, newItem;
    // 1. Get field input data
    input = UICtrl.getInput();
    
    if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2.  Add item to balance controller
      newItem = balanceCtrl.addItem(input.type, input.description, input.value)
      //3. Add item to UI
      UICtrl.addListItem(newItem, input.type)

      //4.  Clear fields
      UICtrl.clearFields();
      
      //5. Calculate and update balance
      updateBalance();

    }
  };

  const ctrlDeleteItem = function(event) {
    let splitID, type, ID;

    let itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemId) {
      //inc-id
      splitID = itemId.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. delete item from data structure
      balanceCtrl.deleteItem(type, ID);

      //2. delete item from user interface
      UICtrl.deleteListItem(itemId);

      //3.  Update and show the new budget
      updateBalance();
    }
  }

  return {
    init: function() {
      console.log("App has started");
      UICtrl.displayBalance({
        balance: 0,
        totalInc: 0,
        totalExp: 0,
        percentage : -1
      });
      setupEventListeners();
    }
  }
    
})(balanceController, UIController);

controller.init();
