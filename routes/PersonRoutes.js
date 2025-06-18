const express = require('express');
const router = express.Router();


// Import the Person model from the models directory
const Person = require('../models/person'); 

// POST method to create a new person
router.post('/', (req, res) => {
    const data = req.body; // assuming data is in the request body

    const newPerson = new Person(data);  // create a new person document using mongoose model.

    // save the new person document to the database
    newPerson.save()
        .then(() => {
            res.status(201).json({ message: 'Person created successfully' });
        })
        .catch((err) => {
            console.error('Error creating person:', err);
            res.status(500).json({ error: 'Failed to create person' });
        });
})

// get method to get te  persons data from database
router.get('/', async (req, res) => {
    {
        try {
            const personsData = await Person.find(); // Fetch all persons from the database
            res.status(200).json(personsData); // Send the persons data as a JSON response
            console.log('Persons fetched successfully:', personsData);
        }
        catch (err) {
            console.error('Error fetching persons:', err);
            res.status(500).json({ error: 'Failed to fetch persons' });
        }

    }
});

// GET method to fetch persons by work type
router.get('/:workType', async (req, res) => {

    try {
        const workType = req.params.workType; // get the work type from the request parameters
        if (workType == "chef" || workType == "waiter" || workType == "manager") {
            // Assuming workType is a valid work type

            const persons = await Person.find({ work: workType }); // find persons with the specified work type
            console.log("ressponse fetched !");
            res.status(200).json(persons); // send the persons as a JSON response
        }
    }
    catch(err){
        console.error('Error fetching persons by work type:', err);
        res.status(500).json({ error: 'Failed to fetch persons by work type' });
    }
});

// PUT method to update a person's data
router.put('/:id', async (req ,res)=>{
    const personId = req.params.id; // get the person ID from the request parameters
    const updatedData = req.body; // get the updated data from the request body
    try{
        const updatedPerson = await Person.findByIdAndUpdate(personId, updatedData ,{
            new: true, // return the updated document
            runValidators: true , // validate the updated data against the schema
            
        })
        console.log('Person updated successfully:', updatedPerson);

        if (!updatedPerson) {
            return res.status(404).json({ error: 'Person not found' }); // if person not found, return 404
        }
    }
    catch(error){
        console.error('Error updating person:', error);
        res.status(500).json({ error: 'Failed to update person' });
    }
})

// DELETE method to delete a person by ID   
router.delete('/:id', async(req , res)=>{
    const personId = req.params.id; // get the person ID from the request parameters
    try{
        const deletedPerson  = await Person.findByIdAndDelete(personId); // delete the person by ID
        if(!deletedPerson) {
            return res.status(404).json({ error: 'Person not found' }); // if person not found, return 404
        }
        console.log('Person deleted successfully:', deletedPerson);
    }
    catch(error){
        console.error('Error deleting person:', error);
        res.status(500).json({ error: 'Failed to delete person' });
    }
}
)

// Export the router to use in the main server file
module.exports = router;
// This router can be used in the main server file to handle requests related to persons.