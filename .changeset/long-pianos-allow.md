---
"@shopware-pwa/helpers-next": patch
---

Prevent from getting an incorrect srcset format when img url is not set.

before when there were no urls for 400w and 800w: 
`src="image1.jpg 100w, 400w, 800w"` 

now only the entry with an URL defined is returned
