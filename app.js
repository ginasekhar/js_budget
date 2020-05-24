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

    calculateBalance : function() {
      //calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      //calculate balance (income - expense)
      data.balance = data.totals.inc - data.totals.exp;

      //calculate expense as percent of income
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);
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
    expensesContainer: '.expenses__list'
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
        html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      } else if (type === 'exp'){
        element = DOMstrings.expensesContainer;
        html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">10%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div> </div>'
      };

      //replace place holder with data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      //insert html into DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
      })

  }
  const updateBalance = function() {
    //5. Calculate balance
    balanceCtrl.calculateBalance();

    //2. Return the balance
    let balance = balanceCtrl.getBalance();

    //6. Display balance on UI
     console.log(balance);
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

  return {
    init: function() {
      console.log("App has started");
      setupEventListeners();
    }
  }
    
})(balanceController, UIController);

controller.init();
