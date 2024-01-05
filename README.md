# carSeer - Public edition. 
<h3>Application for adding and browsing car offers, made with React + TailwindCSS, Express and Mongoose Database.</h3>
Private version has to remain private till the day of Engineer thesis defendence.

--
![image](https://github.com/klimek00/carSeer-pub/assets/36035343/f8c6653c-cbad-431a-b7fe-d5de45406879)

<p>All folders and functions are somewhat organized. Pages have their own folder and are divided in components, image are stored in images, functions has own folder and subfolders.</p>

![image](https://github.com/klimek00/carSeer-pub/assets/36035343/4d7cc414-e8db-43f0-918c-4b196b3a03aa)

User may log in or register, gaining additional access to server's functionality, such adding own offers and adding to bookmarks (by default, Bookmarks are stored in Browser's localStorage). Upon pressing "Sign up or in", a modal is displayed. **Modal is hardly in WIP** and will allow to log in via Google and Apple services.
![image](https://github.com/klimek00/carSeer-pub/assets/36035343/c40184d9-4552-411a-b6d7-7eb502f3de46)
Input's are validated with common requirements (password >=8 characters, user cannot contain special characters) both in Client and Server, alerting user with specific requirements. 
<p>Session is maintained in Cookie via token (JWT), expiring in 1 hour or 30 days.</p>

` const verifyToken = (req, res, next) => {
// validation
...
jwt.verify(token, secretKey, (err, decoded) => {
...`

<p>Token is for veryfying if user is the user he logged in, preventing from logging and changing username for priviliges. </p>

```
app.post('/ownOffers', verifyToken, async (req, res) => {
  let {username} = req.body
//convert to HTML
...

  if (req.user.username !== username) {
    res.status(401).json({note: 'noAccess'})
  ...
...
```

Logged user may add, edit and remove own offers. Creating add offers was tricky one, because of many many inputs and verifiers you need to do. In the end I decided to create "Schematic" named updateCarListing for listed car, containing data and setting data onChange of certain input.
`const { carData, setType, setBrand, 
      ...,
      setDescription, setPrice, setPriceCurrency
    } = updateCarListing()
`
When user has finished typing in input, there's `onBlur` evoking:
`onBlur={(e) => handleInputBlur("mileage", e.target.value)}` 
Thanks to it, it is able to verify data in each input independently, and warning users for bad input **after** he has finsihed typing.
![image](https://github.com/klimek00/carSeer-pub/assets/36035343/54c4af5b-ee2f-4dcd-bbd7-cceee67e5df8)

Application allows for all users to browse cars and owners' other offers, using most common parameters.
Server is prepared for XSS and GET attacks, thus a `setFilterConditions` function is used. It executes only defined paremeters, preventing from undefined fetches.
```
function setFilterConditions (params) {
  try {
    let filterConditions = {}
  
  // validation
  ...
    const addFilterCondition = (field, deep) => {
      if (params[field] !== 'any') {
        filterConditions[deep ? `details.${field}` : field] = params[field]
      }
    }

    //prevent other undefined conditions
    addFilterCondition('brand', true)
...
}
```
Additional parameters may be added manually in server's function setFilterConditions.

Not logged user may use bookmarks, using Browsers' localStorage. Upon pressing Bookmark Icon in cars' card, function `updateBookmark` is evoked which adds or removes car to localStorage, depending if it exists or not. Function returns most important details about added car to verify if user added the car he wanted or not. Cars are stored via JSON.
```
export default async function updateBookmark(e, carToAdd) {
//validation
...
// check if car._id exists in storage; if true remove it 
  if (favCarsList.find((car) => car._id === carToAdd._id)) {
    favCarsList = favCarsList.filter(car => car._id !== carToAdd._id)
    // console.log(favCarsList)
    localStorage.setItem('carSeerFavCars', JSON.stringify(favCarsList))
    
    e.target.style.filter = ""
    return {action: "deleted", productionYear: carToAdd.details.productionYear, brand: carToAdd.details.brand, model: carToAdd.details.model}
  }
...
```
