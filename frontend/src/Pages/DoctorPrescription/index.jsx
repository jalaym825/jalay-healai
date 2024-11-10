import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "../../UIs/shadcn-ui/card";
import { Button } from "../../UIs/shadcn-ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../UIs/shadcn-ui/select';
import { Input } from "../../UIs/shadcn-ui/input";
import {
    Pill,
    Plus,
    Save,
    ClipboardCheck,
    Trash2,
    Search
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import Global from '@/Utils/Global';
import { toast } from 'sonner';

// Custom debounce hook
const useDebounce = (callback, delay) => {
    const timeoutRef = useRef(null);

    const debouncedCallback = useCallback((...args) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);

    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return debouncedCallback;
};

const DoctorPrescription = () => {
    const { id: appointmentId } = useParams();
    const [patientEmail, setPatientEmail] = useState('');
    const [medications, setMedications] = useState([
        {
            medicine_id: '',
            time: 'MORNING',
            quantity: 1,
            eat_time: 'AFTER'
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    // Search function
    const searchMedicines = async (query) => {
        if (!query) {
            setSearchResults([]);
            return;
        }
        try {
            const response = await Global.httpGet(`/prescription/search?query=${query}`);
            console.log(response);
            setSearchResults(response.results || []);
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Failed to search medicines');
        }
    };

    // Debounced search
    const debouncedSearch = useDebounce(searchMedicines, 300);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await Global.httpPost('/prescription/createPrescription', {
                appointment_id: appointmentId,
                prescription_medicine: medications
            });
            console.log(response);
            toast.success('Prescription created successfully');
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMedicationChange = (index, field, value) => {
        const updatedMedications = medications.map((medication, i) => {
            if (i === index) {
                return { ...medication, [field]: value };
            }
            return medication;
        });
        setMedications(updatedMedications);
    };

    const handleSearchInputChange = (query, index) => {
        handleMedicationChange(index, 'medicine_id', query);
        debouncedSearch(query);
    };

    const handleAddMedication = () => {
        setMedications([
            ...medications,
            {
                medicine_id: '',
                time: 'MORNING',
                quantity: 1,
                eat_time: 'AFTER'
            }
        ]);
    };

    const handleRemoveMedication = (index) => {
        if (medications.length > 1) {
            setMedications(medications.filter((_, i) => i !== index));
        }
    };

    const handleSelectMedicine = (medicineId, index) => {
        handleMedicationChange(index, 'medicine_id', medicineId);
        setSearchResults([]);
    };

    return (
        <div className="max-w-5xl mx-auto p-4">
            <form onSubmit={handleSubmit}>
                <Card className="bg-gradient-to-br from-teal-50 to-white shadow-lg">
                    <CardHeader className="border-b border-teal-100 pb-6">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-2xl font-bold text-teal-700">Prescription Form</h2>
                            <div className="text-sm text-gray-500">
                                Date: {new Date().toLocaleDateString()}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6 space-y-6 w-full">
                        <div className="bg-white w-full rounded-xl p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <Pill className="w-5 h-5 text-teal-600" />
                                    <h3 className="font-semibold text-teal-700">Prescribed Medications</h3>
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleAddMedication}
                                    className="bg-teal-100 hover:bg-teal-200 text-teal-700"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Add Medication
                                </Button>
                            </div>

                            {medications.map((medication, index) => (
                                <Card key={index} className="w-full font-dm-sans shadow-lg mb-4">
                                    <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-t-lg flex flex-row justify-between items-center">
                                        <CardTitle className="text-xl font-semibold">Medicine #{index + 1}</CardTitle>
                                        {medications.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                className="text-white hover:text-red-200"
                                                onClick={() => handleRemoveMedication(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </CardHeader>
                                    <CardContent className="p-6 bg-white">
                                        <div className="grid grid-cols-2 gap-4 items-center">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-teal-700">
                                                    Medicine ID
                                                </label>
                                                <div className="relative">
                                                    <Input
                                                        value={medication.medicine_id}
                                                        onChange={(e) => handleSearchInputChange(e.target.value, index)}
                                                        placeholder="Search medicine..."
                                                        className="w-full border-teal-200 focus:border-teal-500 focus:ring-teal-500 pr-8"
                                                    />
                                                    <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                    {searchResults.length > 0 && (
                                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                                                            {searchResults.map((result) => (
                                                                <div
                                                                    key={result.id}
                                                                    className="px-4 py-2 hover:bg-teal-50 cursor-pointer"
                                                                    onClick={() => handleSelectMedicine(result.id, index)}
                                                                >
                                                                    {result.name}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-teal-700">Time</label>
                                                <Select
                                                    value={medication.time}
                                                    onValueChange={(value) => handleMedicationChange(index, 'time', value)}
                                                >
                                                    <SelectTrigger className="w-full border-teal-200 bg-white hover:border-teal-300">
                                                        <SelectValue placeholder="Select time" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        <SelectItem value="MORNING" className="hover:bg-teal-50">Morning</SelectItem>
                                                        <SelectItem value="AFTERNOON" className="hover:bg-teal-50">Afternoon</SelectItem>
                                                        <SelectItem value="EVENING" className="hover:bg-teal-50">Evening</SelectItem>
                                                        <SelectItem value="NIGHT" className="hover:bg-teal-50">Night</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-teal-700">
                                                    Quantity
                                                </label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={medication.quantity}
                                                    onChange={(e) => handleMedicationChange(index, 'quantity', parseInt(e.target.value))}
                                                    className="w-full border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-teal-700">Eat Time</label>
                                                <Select
                                                    value={medication.eat_time}
                                                    onValueChange={(value) => handleMedicationChange(index, 'eat_time', value)}
                                                >
                                                    <SelectTrigger className="w-full border-teal-200 bg-white hover:border-teal-300">
                                                        <SelectValue placeholder="Select eat time" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        <SelectItem value="BEFORE" className="hover:bg-teal-50">Before Meal</SelectItem>
                                                        <SelectItem value="AFTER" className="hover:bg-teal-50">After Meal</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>

                    <CardFooter className="border-t border-teal-100 p-6">
                        <div className="flex justify-end space-x-4 w-full">
                            <Button
                                type="submit"
                                className={`bg-gradient-to-r from-teal-500 to-teal-700 text-white hover:from-teal-600 hover:to-teal-800 rounded-xl px-6 py-2 transform transition-transform hover:scale-105 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <svg
                                            className="animate-spin h-5 w-5 mr-2 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8H4z"
                                            ></path>
                                        </svg>
                                        Completing...
                                    </div>
                                ) : (
                                    <>
                                        <ClipboardCheck className="w-4 h-4 mr-2" />
                                        Complete Consultation
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
};

export default DoctorPrescription;
