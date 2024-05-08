import React, { useState, useEffect } from "react";
import axios from 'axios';

function MedicineDetails(props) {
    const { onMedicineData, parentId } = props;
    const [medicineOptions, setMedicineOptions] = useState([]); // Store medicine names
    const [medicineError, setMedicineError] = useState('');
    const [inputText, setInputText] = useState(''); // State to store input text
    const [showList, setShowList] = useState(false); // State to manage list visibility

    const fetchMedicineNames = async () => {
        try {
            const response = await axios.get('https://15.206.80.235:9000/medicineNames');
            if (response.status === 200) {
                const data = response.data; // Assuming the response is an array of objects with medicine_id and name
                setMedicineOptions(data);
            }
        } catch (error) {
            console.error("Error fetching medicine names:", error);
        }
    };  

    useEffect(() => {
        fetchMedicineNames();
    }, []);

    const handleMedicineSelection = (selectedMedicineId, selectedMedicineName) => {
        // Notify the parent component about the selected medicine
        onMedicineData(selectedMedicineId);
        setInputText(selectedMedicineName); // Update inputText with selected medicine name
        setShowList(false); // Close the list
    };

    const filterMedicineOptions = (input) => {
        return medicineOptions.filter(option =>
            option.name.toLowerCase().includes(input.toLowerCase())
        );
    };

    const handleInputChange = (e) => {
        setInputText(e.target.value);
        setShowList(true); // Show the list when user types in the input
    };

    return (
        <div className="position-relative">
            <input
                type="text"
                className="form-control mx-auto w-50"
                placeholder="Enter Medicine"
                value={inputText}
                onChange={handleInputChange}
            />
            {showList && (
                <ul className="list-group w-50 mx-auto mt-2 position-absolute start-0">
                    {filterMedicineOptions(inputText).map((option) => (
                        <li
                            key={option.medicine_id}
                            className="list-group-item"
                            onClick={() => handleMedicineSelection(option.medicine_id, option.name)}
                        >
                            {option.name}
                        </li>
                    ))}
                </ul>
            )}
            <div className="text-red-500 mt-2">{medicineError}</div>
        </div>
    );
}

export default MedicineDetails;
