import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "../../UIs/shadcn-ui/card";
import { Button } from "../../UIs/shadcn-ui/button";
import { Input } from "../../UIs/shadcn-ui/input";
import {
    Pill,
    Plus,
    Trash2,
    Save,
    ClipboardCheck
} from 'lucide-react';
import { useParams } from 'react-router-dom';

const DoctorPrescription = () => {
    const { id: appointmentId } = useParams();
    const [formData, setFormData] = useState({
        patientInfo: {
            email: '',
            age: '',
            gender: '',
            contact: '',
        },
        medications: [
            { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
        ],
    });

    const handleAddMedication = () => {
        setFormData({
            ...formData,
            medications: [
                ...formData.medications,
                { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
            ]
        });
    };

    const handleRemoveMedication = (index) => {
        const newMedications = formData.medications.filter((_, i) => i !== index);
        setFormData({ ...formData, medications: newMedications });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Consultation data:', formData);
        // Handle form submission
    };

    return (
        <div className="max-w-5xl mx-auto p-4">
            <form onSubmit={handleSubmit}>
                <Card className="bg-gradient-to-br from-teal-50 to-white shadow-lg">
                    <CardHeader className="border-b border-teal-100 pb-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-teal-700">Prescription Form</h2>
                            <div className="text-sm text-gray-500">
                                Date: {new Date().toLocaleDateString()}
                            </div>
                        </div>
                        {/* Patient Basic Info */}
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <h3 className="text-lg font-semibold text-teal-700 mb-4">Patient Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm text-gray-500">Patient email</label>
                                    <Input
                                        placeholder="Enter patient email"
                                        className="mt-1"
                                        value={formData.patientInfo.name}
                                        onChange={e => setFormData({
                                            ...formData,
                                            patientInfo: { ...formData.patientInfo, email: e.target.value }
                                        })}
                                    />
                                </div>
                               
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6 space-y-6">
                       
                        <div className="bg-white rounded-xl p-4 shadow-sm">
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

                            <div className="space-y-4">
                                {formData.medications.map((med, index) => (
                                    <div key={index} className="border rounded-lg p-4 relative">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-sm text-gray-500">Medicine Name</label>
                                                <Input
                                                    placeholder="Medicine name"
                                                    value={med.name}
                                                    onChange={e => {
                                                        const newMeds = [...formData.medications];
                                                        newMeds[index].name = e.target.value;
                                                        setFormData({ ...formData, medications: newMeds });
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Dosage</label>
                                                <Input
                                                    placeholder="e.g., 500mg"
                                                    value={med.dosage}
                                                    onChange={e => {
                                                        const newMeds = [...formData.medications];
                                                        newMeds[index].dosage = e.target.value;
                                                        setFormData({ ...formData, medications: newMeds });
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Frequency</label>
                                                <Input
                                                    placeholder="e.g., Twice daily"
                                                    value={med.frequency}
                                                    onChange={e => {
                                                        const newMeds = [...formData.medications];
                                                        newMeds[index].frequency = e.target.value;
                                                        setFormData({ ...formData, medications: newMeds });
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <label className="text-sm text-gray-500">Duration</label>
                                                <Input
                                                    placeholder="e.g., 5 days"
                                                    value={med.duration}
                                                    onChange={e => {
                                                        const newMeds = [...formData.medications];
                                                        newMeds[index].duration = e.target.value;
                                                        setFormData({ ...formData, medications: newMeds });
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Special Instructions</label>
                                                <Input
                                                    placeholder="e.g., Take after meals"
                                                    value={med.instructions}
                                                    onChange={e => {
                                                        const newMeds = [...formData.medications];
                                                        newMeds[index].instructions = e.target.value;
                                                        setFormData({ ...formData, medications: newMeds });
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {formData.medications.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                onClick={() => handleRemoveMedication(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="border-t border-teal-100 p-6">
                        <div className="flex justify-end space-x-4 w-full">
                            <Button
                                type="button"
                                variant="outline"
                                className="border-teal-500 text-teal-700 hover:bg-teal-50"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Draft
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-teal-500 to-teal-700 text-white hover:from-teal-600 hover:to-teal-800"
                            >
                                <ClipboardCheck className="w-4 h-4 mr-2" />
                                Complete Consultation
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
};

export default DoctorPrescription;