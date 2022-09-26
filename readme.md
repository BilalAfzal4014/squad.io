# Jump Backend Task

Test Project for Squad.io

## Installation

Run the following command to install dependencies

```bash
npm install
```

## Usage

```python
# run the following command to run the project

npm run start
```

## Logic for cache miss
I will suggest you to first look at the code and then read the description here (I have try to write the self explanatory code ). Incase of cache miss it will insert the record if limit is not reached. Incase of limit is reached it will fetch the cache which time to live has expired and replace it with new one. Incase time to live is yet to expire for all the records then it will try to fetch two records one for least hit and other for last hit. If last hit record has the gap of more than equals to least hit record then replace last hit cache record otherwise if last hit cache has total hits greater than two times least hit cache then replace least hit cache else replace last hit cache.


## Improvisation
Concurrent request handling can be improved. If you people want me to do it then I can go extra mile
