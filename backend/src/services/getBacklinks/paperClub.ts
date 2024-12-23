import axios from "axios";
import pLimit from "p-limit";
import axiosRetry from "axios-retry";

const urls = [
  "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=1&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=2&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=3&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=4&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=5&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=6&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=7&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=8&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=9&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=10&l=1000",

  "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=1&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=2&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=3&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=4&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=5&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=6&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=7&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=8&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=9&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=10&l=1000",

  "https://app.paper.club/api/advanced_search/site?to[]=Ldq4776UG7sUwY3LbITbT&to[]=3kXbOrGnl74aNO716uz1GB&to[]=3TauAx64ZLTuOFWoglrcIS&to[]=1ZQKxyP9VDVQe7qwjtIh4z&to[]=52XKP5ETB8KW39T7PUrgiU&p=1&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=Ldq4776UG7sUwY3LbITbT&to[]=3kXbOrGnl74aNO716uz1GB&to[]=3TauAx64ZLTuOFWoglrcIS&to[]=1ZQKxyP9VDVQe7qwjtIh4z&to[]=52XKP5ETB8KW39T7PUrgiU&p=2&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=Ldq4776UG7sUwY3LbITbT&to[]=3kXbOrGnl74aNO716uz1GB&to[]=3TauAx64ZLTuOFWoglrcIS&to[]=1ZQKxyP9VDVQe7qwjtIh4z&to[]=52XKP5ETB8KW39T7PUrgiU&p=3&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=Ldq4776UG7sUwY3LbITbT&to[]=3kXbOrGnl74aNO716uz1GB&to[]=3TauAx64ZLTuOFWoglrcIS&to[]=1ZQKxyP9VDVQe7qwjtIh4z&to[]=52XKP5ETB8KW39T7PUrgiU&p=4&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=Ldq4776UG7sUwY3LbITbT&to[]=3kXbOrGnl74aNO716uz1GB&to[]=3TauAx64ZLTuOFWoglrcIS&to[]=1ZQKxyP9VDVQe7qwjtIh4z&to[]=52XKP5ETB8KW39T7PUrgiU&p=5&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=Ldq4776UG7sUwY3LbITbT&to[]=3kXbOrGnl74aNO716uz1GB&to[]=3TauAx64ZLTuOFWoglrcIS&to[]=1ZQKxyP9VDVQe7qwjtIh4z&to[]=52XKP5ETB8KW39T7PUrgiU&p=6&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=Ldq4776UG7sUwY3LbITbT&to[]=3kXbOrGnl74aNO716uz1GB&to[]=3TauAx64ZLTuOFWoglrcIS&to[]=1ZQKxyP9VDVQe7qwjtIh4z&to[]=52XKP5ETB8KW39T7PUrgiU&p=7&l=1000",

  "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=1&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=2&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=3&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=4&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=5&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=6&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=7&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=8&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=9&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=10&l=1000",

  "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=1&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=2&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=3&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=4&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=5&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=6&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=7&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=8&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=9&l=1000",

  "https://app.paper.club/api/advanced_search/site?to[]=5sn2Bn22ZGvZPc5LYA3di4&to[]=553UTBorQce1yqRZ9MjVTo&to[]=4eO8FdZGKUr7Rq0PEEeYZ7&to[]=3Pbqm9xPhlaNTgT4UFX9MR&to[]=7BWaUW2K8TgTVD4ZWnkvcx&p=1&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=5sn2Bn22ZGvZPc5LYA3di4&to[]=553UTBorQce1yqRZ9MjVTo&to[]=4eO8FdZGKUr7Rq0PEEeYZ7&to[]=3Pbqm9xPhlaNTgT4UFX9MR&to[]=7BWaUW2K8TgTVD4ZWnkvcx&p=2&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=5sn2Bn22ZGvZPc5LYA3di4&to[]=553UTBorQce1yqRZ9MjVTo&to[]=4eO8FdZGKUr7Rq0PEEeYZ7&to[]=3Pbqm9xPhlaNTgT4UFX9MR&to[]=7BWaUW2K8TgTVD4ZWnkvcx&p=3&l=1000",

  "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=1&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=2&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=3&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=4&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=5&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=6&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=7&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=8&l=1000",
  "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=9&l=1000",
];

const limit = pLimit(3);

const Token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MzQwMzc1MjQsImV4cCI6MTczNjYyOTUyNCwicm9sZXMiOlsiUk9MRV9QVUJMSVNIRVIiXSwidXNlcm5hbWUiOiJnb25nZ29uZzYyNDcyMUBnbWFpbC5jb20iLCJjZXJ0aWZpZWQiOnRydWV9.WpzBc0LdZ5qZIBF0cCVsvN9I_azRd1dPmToJNGo_kWpbealOWGVb9wWGKmF8g7zV47EIAtN-TkfZD3kdmHWK1wH7WNP9u6zguJm7Ne-yi1S2m1doY_iLHUbihohLDMo6ONU2aBV0VtYNFcBhz6hzAtftYRdwULIFHufITwO_mNwkq-kNHOFPLiEBgQzWQ-nNcpc1rTDUoL0VrHtkkfqchAMihtg81E50EGIuPbyaEEArTc69FeANOaQpCGz8WEw_zsOgIVQnn40CLWCl5mMGpFisSxPiWpYFPk-gBHunQIAgVziwdXQM1ii1ea_XoWefn0VBtPGZfKys-vDa4yNEjcUCI5BBR4DpUrHb_KPjyMOh_0fxoDpKPeW0q84UT444eZudYY0dXgNkqlR1WXyNG6sTbzgHIvSU-_17Rag7ZZMKu-ZwWdZjsES5c2PN6e2dSwALLWfMLNWntpcEBfkH1l81usLDQGofHR3rPlKh-Sk7KZEwECbEM_ZEWdoXJjWXzebFf3t1UZeVR9cwGtEIQ1_mE-xXA-mtRIP09UgYhD_AoHYnECLP4_wWtFX2DVgskPhhazPL6RjLyBUQxw0XBOZIDKMEaLyCic1oHOwujltKFN6lv6xZpDc4k-LS77cf5Cdrg-cVUtAnQPSCsqxbUcXpCaC3Qy_0iElMS8SqtH0";


interface PaperclubData {
  domain: string;
  tf: string | number;
  cf: string | number;
  rd: string | number;
  price: string | number;
}

interface Result {
  name?: string;
  kpi?: {
    trustFlow?: number;
    citationFlow?: number;
    refDomain?: number;
  };
  articles?: {
    price?: number;
  }[];
}
  
  
// Setup retry mechanism with axios
axiosRetry(axios, {
  retries: 3, // Retry failed requests up to 3 times
  retryDelay: (retryCount) => retryCount * 1000, // Retry delay with exponential backoff
  retryCondition: (error) => axios.isAxiosError(error), // Retry only Axios-related errors
});

// Function to fetch data from a single URL with timeout and retry
const fetchDataFromUrl = async (url : string) => {
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${Token}` },
      timeout: 30000, // Set timeout to 10 seconds
    });
    return response.data.currentPageResults || [];
  } catch (error : any) {
    console.error(`Failed to fetch URL: ${url}`, error.message);
    return []; // Return an empty array in case of failure
  }
};

// Function to process URLs in batches with p-limit
export const getPaperclubData = async () => {
  if (!Token) {
    throw new Error("API token is missing");
  }

  const limit = pLimit(5); // Limit concurrent requests to 5
  const batchSize = 10; // Process 10 URLs in a batch
  let allData : PaperclubData[] = [];

  for (let i = 0; i < urls.length; i += batchSize) {
    const batchUrls = urls.slice(i, i + batchSize);
    // console.log(`Processing batch: ${batchUrls}`);

    // Fetch data for the current batch of URLs
    const batchResults = await Promise.all(
      batchUrls.map((url) => limit(() => fetchDataFromUrl(url)))
    );

    // console.log(`Batch results:`, batchUrls);

    // Flatten and process the results
    batchResults.forEach((results) => {
      if (results && Array.isArray(results)) {
        allData.push(
          ...results.map((result: Result) => {
            const kpi = result.kpi || {};
            const article = result.articles?.[0] || {};
    
            return {
              domain: result.name || "Unknown",
              tf: kpi.trustFlow || 0,
              cf: kpi.citationFlow || 0,
              rd: kpi.refDomain || 0,
              price: article.price || 0,
            };
          })
        );
      }else{
        console.error(`Unexpected result format for batch: ${batchUrls}`);
      }
    });
  }

  return allData;
};