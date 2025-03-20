NOTE(Adin): =={contents}== is an optional enhancement

# TODO (Not in Chronological Order)
- [ ] Database schemas
- [ ] Mock data
- [ ] Checkout screen (from interview)
    - [ ] Checking out
        - [ ] Select specializations
    - [ ] ==Search==
    - [ ] ==Sort by most ordered==
- [ ] Admin panel
    - [ ] Add / remove employees
    - [ ] Editing menus
        - [ ] Set current menu
        - [ ] Create / delete menus
        - [ ] Create / delete items
        - [ ] Modify item specializations
        - [ ] Add / remove items from menus (seperately from adding / deleting)
    - [ ] Tipping calculations
    - [ ] Transaction history
- [ ] Authentication
- [ ] Figure out deployment scheme

# Database
## Notes
- 1 Global Database

### Menus / Items
- Multiple Restaurants
- Multiple Menus per restaurant
    - ==Ability to automatically select a menu==
- Multiple items per restaurant
- Multiple "options" per item
- *Items can **NEVER** be deleted from the database because they are needed for
  transaction history*

### Users / Employees
- 1 "owner" per restaurant (discord model where the owner has all admin perms and cannot be removed)
- Multiple "managers" per restaurant
- Many "cashiers"
- Need to track clock in / out times
- Pin used to identify which employee compleated which transaction

- If an employee is employed by multipe restaurants they will need a seperate
  account for _each_

### Transactions
- Total amount
- Date / Time
- Customer id ==(email if receipt is emailed)==
- Need to track tips and total _seperately_
- ==Support multiple currencies==
- ==Support for sales tax==

## Schema
#### Restaurants
| id | name | owner_id -> employees.id | current_menu_id -> menus.id |

#### Employees
| id | name | uesrname | salt | password+salt hash | restaurant_id -> restaurants.id | pin |

#### WorkingIntervals (TODO(Adin): Rename Me)
| id | user_id -> employees.id | restaurant_id | time_in | time_out? |

#### Menus
| id | restaurant_id -> restaurants.id | name | ==selection_criteria?== |

#### Items
| id | menu_id -> menus.id | name | description | base_price |

#### Specializations
TODO(Adin): Figure out how to best store selection options (min / max,
            exclusives [amongst specializations on the same item], etc.)

| id | item_id -> items.id | name | price |

#### Transactions
| id | restaurant_id -> restaurants.id | employee_id -> employees.id | date | tip_amount | ==tax_region?== | ==customer_id?== |

#### Transaction Items
| id | transaction_id -> transactions.id | item_id -> items.id |

#### Transaction Item Specializations
| id | transaction_item -> transaction_items.id | specialization_id -> specializations.id |
