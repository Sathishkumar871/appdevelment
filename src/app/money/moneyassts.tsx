import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    Linking,
    Platform,
    Dimensions
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiPressable } from 'moti';
import RNPickerSelect from 'react-native-picker-select';
import Slider from '@react-native-community/slider';
import { BlurView } from 'expo-blur';

// --- Data & Constants ---
const content = {
    en: {
        title: 'Pawn Shop', subtitle: 'Pledge your assets and get cash quickly.', trustBanner: 'Live Verification • Money in 2 Hours', yourDetails: 'Your Details', yourFullName: 'Your Full Name', enterName: 'Enter your name', selectMandal: 'Select Your Mandal', selectVillage: 'Select Your Village', selectAsset: 'Select Your Asset', pledgeItem: 'Pledge Item', vehicleDetails: 'Vehicle Details', company: 'Company', selectCompany: 'Select Company', model: 'Model', selectModel: 'Select Model', vehicleYear: 'Vehicle Year', enterYear: 'e.g., 2018', loanAmount: 'Loan Amount', estimatedAmount: 'Estimated Amount (₹)', maximumLoan: 'Maximum Loan (₹)', yourLoan: 'Your Desired Loan (₹)', sendOnWhatsapp: 'Send Details on WhatsApp', bookVerification: 'Book Your Live Verification', scheduleDescription: 'Thank you for submitting! Please book a convenient time for our team to conduct a live check of your asset.', selectTimeSlot: 'Select a Time Slot', selectTime: 'Select an available time', policyTitle: 'Our Policy & Trust', faq1Question: '1. How long does the process take?', faq1Answer: 'After live verification, if all is correct, the money transfer is initiated within 2 hours.', confirmationMessage: 'Your appointment has been successfully booked!', goldDetails: 'Gold Details', goldWeight: 'Gold Weight (grams)', afterHoursMessage: 'It is past 9 PM. We are currently closed for live verification. Please contact customer support.', customerSupport: 'Contact Customer Support', bookAppointment: 'Book Appointment', goldMarketRate: 'Current Gold Rate (per gram)', requiredDocuments: 'Required Documents', aadhaarCard: 'Aadhaar Card', panCard: 'PAN Card', assetOwnership: 'Asset Ownership Papers', agreeToTerms: 'I agree to the terms and conditions.', loanSummary: 'Loan Summary', repaymentPeriod: 'Repayment Period', interestRate: 'Interest Rate (per month)', totalRepayment: 'Total Repayment', monthlyInstallment: 'Monthly Installment', selectVehicleType: 'Select Vehicle Type', vehicleType: 'Vehicle Type'
    },
    te: {
        title: 'తాకట్టు దుకాణం', subtitle: 'మీ ఆస్తులను తాకట్టు పెట్టి త్వరగా డబ్బు పొందండి.', trustBanner: 'లైవ్ వెరిఫికేషన్ • 2 గంటల్లో డబ్బు', yourDetails: 'మీ వివరాలు', yourFullName: 'మీ పూర్తి పేరు', enterName: 'మీ పేరును ఎంటర్ చేయండి', selectMandal: 'మీ మండలాన్ని ఎంచుకోండి', selectVillage: 'మీ గ్రామాన్ని ఎంచుకోండి', selectAsset: 'మీ ఆస్తిని ఎంచుకోండి', pledgeItem: 'తాకట్టు పెట్టే వస్తువు', vehicleDetails: 'వాహన వివరాలు', company: 'కంపెనీ', selectCompany: 'కంపెనీని ఎంచుకోండి', model: 'మోడల్', selectModel: 'మోడల్‌ను ఎంచుకోండి', vehicleYear: 'వాహనం సంవత్సరం', enterYear: 'ఉదా., 2018', loanAmount: 'లోన్ మొత్తం', estimatedAmount: 'అంచనా వేసిన మొత్తం (₹)', maximumLoan: 'గరిష్ఠ లోన్ మొత్తం (₹)', yourLoan: 'మీకు కావలసిన లోన్ (₹)', sendOnWhatsapp: 'వివరాలను WhatsAppలో పంపండి', bookVerification: 'మీ లైవ్ వెరిఫికేషన్ బుక్ చేసుకోండి', scheduleDescription: 'ధన్యవాదాలు! మీ ఆస్తిని లైవ్ లో చెక్ చేయడానికి మా టీం కోసం ఒక సమయాన్ని ఎంచుకోండి.', selectTimeSlot: 'ఒక టైమ్ స్లాట్‌ను ఎంచుకోండి', selectTime: 'అందుబాటులో ఉన్న సమయాన్ని ఎంచుకోండి', policyTitle: 'మా విధానం & నమ్మకం', faq1Question: '1. ఈ ప్రక్రియ ఎంత సమయం పడుతుంది?', faq1Answer: 'లైవ్ వెరిఫికేషన్ తర్వాత, అన్నీ సరిగ్గా ఉంటే 2 గంటల్లో డబ్బు బదిలీ చేయబడుతుంది.', confirmationMessage: 'మీ అపాయింట్‌మెంట్ విజయవంతంగా బుక్ చేయబడింది!', goldDetails: 'బంగారం వివరాలు', goldWeight: 'బంగారం బరువు (గ్రాములలో)', afterHoursMessage: 'రాత్రి 9 దాటినందున, ఇప్పుడు లైవ్ వెరిఫికేషన్ సాధ్యం కాదు. సహాయం కోసం కస్టమర్ సపోర్ట్‌ను సంప్రదించండి.', customerSupport: 'కస్టమర్ సపోర్ట్‌ను సంప్రదించండి', bookAppointment: 'అపాయింట్‌మెంట్ బుక్ చేసుకోండి', goldMarketRate: 'ప్రస్తుత బంగారం ధర (గ్రాముకు)', requiredDocuments: 'అవసరమైన పత్రాలు', aadhaarCard: 'ఆధార్ కార్డు', panCard: 'పాన్ కార్డు', assetOwnership: 'ఆస్తి యాజమాన్య పత్రాలు', agreeToTerms: 'నేను నిబంధనలు మరియు షరతులను అంగీకరిస్తున్నాను.', loanSummary: 'లోన్ సారాంశం', repaymentPeriod: 'తిరిగి చెల్లింపు వ్యవధి', interestRate: 'వడ్డీ రేటు (నెలకు)', totalRepayment: 'మొత్తం తిరిగి చెల్లింపు', monthlyInstallment: 'నెలవారీ వాయిదా', selectVehicleType: 'వాహన రకాన్ని ఎంచుకోండి', vehicleType: 'వాహన రకం'
    },
};
const vehicleData = {
    Bike: { companies: { Honda: { models: { 'Activa 6G': { baseLoan: 25000, depreciation: 2500, type: 'Scooter' }, 'Shine': { baseLoan: 30000, depreciation: 3000, type: 'Motorcycle' } } }, Bajaj: { models: { 'Pulsar 150': { baseLoan: 35000, depreciation: 3500, type: 'Motorcycle' } } }, Hero: { models: { 'Splendor Plus': { baseLoan: 22000, depreciation: 2000, type: 'Motorcycle' } } }, }, maxLoan: 35000, minLoan: 8000, color: '#3b82f6' },
    Car: { companies: { Maruti: { models: { 'Swift': { baseLoan: 120000, depreciation: 15000, type: 'Hatchback' }, 'Baleno': { baseLoan: 150000, depreciation: 18000, type: 'Hatchback' } } }, Hyundai: { models: { 'Creta': { baseLoan: 250000, depreciation: 25000, type: 'SUV' } } }, }, maxLoan: 250000, minLoan: 50000, color: '#8b5cf6' },
    Gold: { ratePerGram: 5000, maxLoan: 200000, minLoan: 5000, color: '#f59e0b' },
    Mobile: { companies: { Apple: { models: { 'iPhone 15': { baseLoan: 25000, depreciation: 5000, type: 'Smartphone' } } }, Samsung: { models: { 'Galaxy S24': { baseLoan: 22000, depreciation: 4500, type: 'Smartphone' } } }, }, maxLoan: 25000, minLoan: 10000, color: '#10b981' },
};
const locationData = {
    'Korukonda': ['Gadala', 'Burugupudi', 'Dosakayalapalli', 'Narasapuram', 'Raghavapuram', 'Kapavaram', 'Munagala'],
    'Rajanagaram': ['Nandarada', 'Kalavacherla', 'Velugubanda', 'G. Yerrampalem', 'Konda Gunturu'],
    'Rajahmundry Rural': ['Katheru', 'Hukumpeta', 'Torredu', 'Kolamuru'],
};
const LOAN_INTEREST_RATE = 0.02; // 2% per month
const LOAN_REPAYMENT_PERIOD = 6; // 6 months

type PledgeItem = keyof typeof vehicleData | '';
type Mandal = keyof typeof locationData | '';

const MoneyLendingScreen: React.FC = () => {
    const [lang, setLang] = useState('en');
    const t = (key: keyof typeof content.en) => content[lang as keyof typeof content][key];

    const [name, setName] = useState('');
    const [mandal, setMandal] = useState<Mandal>('');
    const [village, setVillage] = useState('');
    const [pledgeType, setPledgeType] = useState<PledgeItem>('');
    const [company, setCompany] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [goldWeight, setGoldWeight] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [calculatedAmount, setCalculatedAmount] = useState(0);
    const [desiredAmount, setDesiredAmount] = useState(0);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [scheduleTime, setScheduleTime] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [documents, setDocuments] = useState({ aadhaar: false, pan: false, ownership: false });
    const [agreed, setAgreed] = useState(false);
    
    const accentColor = pledgeType ? vehicleData[pledgeType].color : '#3b82f6';
    const currentHour = new Date().getHours();
    const isAfterHours = currentHour >= 21 || currentHour < 6;

    const totalRepayment = desiredAmount + (desiredAmount * LOAN_INTEREST_RATE * LOAN_REPAYMENT_PERIOD);
    const monthlyInstallment = totalRepayment / LOAN_REPAYMENT_PERIOD;

    useEffect(() => {
        const handleCalculateAmount = () => {
            const currentYear = new Date().getFullYear();
            let finalAmount = 0;
            if (pledgeType === 'Gold') {
                const weight = parseFloat(goldWeight);
                if (!isNaN(weight)) finalAmount = Math.min(weight * vehicleData.Gold.ratePerGram, vehicleData.Gold.maxLoan);
            } else if (pledgeType && company && model && year) {
                const pledgeYear = parseInt(year);
                if (isNaN(pledgeYear)) return;
                const data = vehicleData[pledgeType];
                if ('companies' in data) {
                    const modelData = data.companies[company as keyof typeof data.companies]?.models?.[model as keyof typeof data.companies[keyof typeof data.companies]['models']];
                    if (modelData) {
                        const age = Math.max(0, currentYear - pledgeYear);
                        const loanValue = Math.max(data.minLoan, modelData.baseLoan - (age * modelData.depreciation));
                        finalAmount = Math.min(loanValue, data.maxLoan);
                        setVehicleType(modelData.type);
                    }
                }
            }
            const roundedAmount = Math.floor(finalAmount / 100) * 100;
            setCalculatedAmount(roundedAmount);
            setDesiredAmount(roundedAmount);
        };
        handleCalculateAmount();
    }, [pledgeType, company, model, year, goldWeight]);

    const handleWhatsAppChat = (messageContent: string) => {
        const phoneNumber = '918179477995'; // Replace with your number
        const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(messageContent)}`;
        Linking.openURL(url).catch(() => Alert.alert('Error', 'WhatsApp is not installed.'));
    };

    const submitInitialDetails = () => {
        if (!name || !mandal || !village || !pledgeType || !agreed) {
            Alert.alert('Missing Details', 'Please fill in all details and agree to the terms.');
            return;
        }
        if (pledgeType === 'Gold' && !goldWeight) {
            Alert.alert('Missing Details', 'Please enter the gold weight.');
            return;
        }
        if (pledgeType !== 'Gold' && (!company || !model || !year)) {
            Alert.alert('Missing Details', 'Please enter all vehicle details.');
            return;
        }

        let message = `*Loan Application Details:*\n\n*Name:* ${name}\n*Mandal:* ${mandal}\n*Village:* ${village}\n*Pledge Item:* ${pledgeType}\n`;
        if (pledgeType === 'Gold') message += `*Gold Weight:* ${goldWeight} grams\n`;
        else message += `*Company:* ${company}\n*Model:* ${model}\n*Year:* ${year}\n`;
        message += `*Desired Loan Amount:* ₹${desiredAmount}\n*Total Repayment:* ₹${totalRepayment.toFixed(0)}\n*Monthly Installment:* ₹${monthlyInstallment.toFixed(0)}\n\n_Please attach photos of your item and documents._`;
        
        handleWhatsAppChat(message);
        setIsFormSubmitted(true);
    };

    const handleScheduleAppointment = () => {
        if (!scheduleTime) {
            Alert.alert('Missing Time Slot', 'Please select a time slot.');
            return;
        }
        const message = `*Appointment Scheduled:*\n\n*Name:* ${name}\n*Pledge Item:* ${pledgeType}\n*Appointment Time:* ${scheduleTime}\n\n_Thank you for booking!_`;
        handleWhatsAppChat(message);
        setShowConfirmation(true);
        setTimeout(() => {
            setShowConfirmation(false);
            resetForm();
        }, 4000);
    };

    const resetForm = () => {
        setName(''); setMandal(''); setVillage(''); setPledgeType(''); setCompany('');
        setModel(''); setYear(''); setGoldWeight(''); setCalculatedAmount(0);
        setDesiredAmount(0); setIsFormSubmitted(false); setScheduleTime('');
        setDocuments({ aadhaar: false, pan: false, ownership: false });
        setAgreed(false);
    };

    const getPickerItems = (data: object | string[]) => {
        if (Array.isArray(data)) return data.map(item => ({ label: item, value: item }));
        return Object.keys(data).map(key => ({ label: key, value: key }));
    };
    const timeSlots = ['09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '02:00 PM - 03:00 PM', '03:00 PM - 04:00 PM', '04:00 PM - 05:00 PM'];

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#172554', '#1e40af', '#3b82f6']} style={StyleSheet.absoluteFill} />
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={styles.header}>
                    <View style={styles.languageSwitcher}>
                        <TouchableOpacity onPress={() => setLang('en')}><Text style={[styles.langButton, lang === 'en' && styles.langButtonActive]}>English</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => setLang('te')}><Text style={[styles.langButton, lang === 'te' && styles.langButtonActive]}>తెలుగు</Text></TouchableOpacity>
                    </View>
                    <Text style={styles.title}>{t('title')}</Text>
                    <Text style={styles.subtitle}>{t('subtitle')}</Text>
                </View>

                <BlurView intensity={80} tint="light" style={styles.card}>
                    {showConfirmation && (
                        <MotiView from={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={styles.confirmationMessage}>
                            <FontAwesome name="star" color="#16a34a" size={18} />
                            <Text style={styles.confirmationText}>{t('confirmationMessage')}</Text>
                        </MotiView>
                    )}

                    {!isFormSubmitted ? (
                        <>
                            <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }}>
                                <Text style={styles.sectionTitle}>{t('yourDetails')}</Text>
                                <View style={styles.inputGroup}><View style={styles.iconWrapper}><FontAwesome name="user" size={16} color="#6b7280" /></View><TextInput style={styles.input} value={name} onChangeText={setName} placeholder={t('enterName')} placeholderTextColor="#9ca3af" /></View>
                                
                                <RNPickerSelect onValueChange={(value) => { setMandal(value as Mandal); setVillage(''); }} items={getPickerItems(locationData)} placeholder={{ label: t('selectMandal'), value: null }} style={pickerSelectStyles} />
                                {mandal && (
                                    <RNPickerSelect onValueChange={(value) => setVillage(value)} items={getPickerItems(locationData[mandal])} placeholder={{ label: t('selectVillage'), value: null }} style={pickerSelectStyles} />
                                )}
                            </MotiView>

                            {name && village && (
                                <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }}>
                                    <Text style={styles.sectionTitle}>{t('selectAsset')}</Text>
                                    <View style={styles.assetGrid}>
                                        {(Object.keys(vehicleData) as PledgeItem[]).map(type => type && (
                                            <MotiPressable key={type} onPress={() => { setPledgeType(type); setCompany(''); setModel(''); setYear(''); setGoldWeight(''); }} style={[styles.assetButton, pledgeType === type && { backgroundColor: accentColor }]} animate={{ scale: pledgeType === type ? 1.05 : 1 }}>
                                                {type === 'Bike' && <FontAwesome name="motorcycle" color={pledgeType === type ? '#fff' : '#4b5563'} size={24} />}
                                                {type === 'Car' && <FontAwesome name="car" color={pledgeType === type ? '#fff' : '#4b5563'} size={24} />}
                                                {type === 'Gold' && <FontAwesome name="diamond" color={pledgeType === type ? '#fff' : '#4b5563'} size={24} />}
                                                {type === 'Mobile' && <FontAwesome name="mobile" color={pledgeType === type ? '#fff' : '#4b5563'} size={24} />}
                                                <Text style={[styles.assetText, pledgeType === type && { color: '#fff' }]}>{type}</Text>
                                            </MotiPressable>
                                        ))}
                                    </View>
                                </MotiView>
                            )}
                            
                            {pledgeType && (
                                <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }}>
                                    {pledgeType === 'Gold' ? (
                                        <><Text style={styles.sectionTitle}>{t('goldDetails')}</Text><View style={styles.inputGroup}><View style={styles.iconWrapper}><FontAwesome name="diamond" size={16} color="#6b7280" /></View><TextInput style={styles.input} value={goldWeight} onChangeText={setGoldWeight} placeholder={t('goldWeight')} keyboardType="numeric" placeholderTextColor="#9ca3af" /></View></>
                                    ) : (
                                        <><Text style={styles.sectionTitle}>{t('vehicleDetails')}</Text><RNPickerSelect onValueChange={(v) => {setCompany(v); setModel('')}} items={getPickerItems(vehicleData[pledgeType]?.companies || {})} placeholder={{ label: t('selectCompany'), value: null }} style={pickerSelectStyles} />
                                        {company && <RNPickerSelect onValueChange={(v) => setModel(v)} items={getPickerItems(vehicleData[pledgeType]?.companies?.[company]?.models || {})} placeholder={{ label: t('selectModel'), value: null }} style={pickerSelectStyles} />}
                                        {model && <View style={styles.inputGroup}><View style={styles.iconWrapper}><FontAwesome name="calendar" size={16} color="#6b7280" /></View><TextInput style={styles.input} value={year} onChangeText={setYear} placeholder={t('enterYear')} keyboardType="numeric" maxLength={4} placeholderTextColor="#9ca3af"/></View>}</>
                                    )}
                                </MotiView>
                            )}
                            {pledgeType === 'Gold' && (
                                <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }}>
                                    <View style={styles.marketRateBox}>
                                        <Text style={styles.loanLabel}>{t('goldMarketRate')}</Text>
                                        <Text style={styles.loanAmount}>₹ {vehicleData.Gold.ratePerGram.toLocaleString('en-IN')}</Text>
                                    </View>
                                </MotiView>
                            )}

                            {calculatedAmount > 0 && (
                                <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                                    <Text style={styles.sectionTitle}>{t('loanAmount')}</Text>
                                    <View style={styles.loanInfoBox}>
                                        <Text style={styles.loanLabel}>{t('maximumLoan')}</Text>
                                        <Text style={styles.loanAmount}>₹ {calculatedAmount.toLocaleString('en-IN')}</Text>
                                    </View>
                                    <View style={[styles.loanInfoBox, {marginTop: 10, backgroundColor: '#e0f2fe'}]}>
                                        <Text style={[styles.loanLabel, {color: accentColor}]}>{t('yourLoan')}</Text>
                                        <Text style={[styles.loanAmount, {color: accentColor}]}>₹ {desiredAmount.toLocaleString('en-IN')}</Text>
                                    </View>
                                    <Slider style={{ width: '100%', height: 40, marginTop: 10 }} minimumValue={vehicleData[pledgeType as PledgeItem]?.minLoan || 0} maximumValue={calculatedAmount} step={100} value={desiredAmount} onValueChange={setDesiredAmount} minimumTrackTintColor={accentColor} maximumTrackTintColor="#d1d5db" thumbTintColor={accentColor} />
                                    
                                    <Text style={styles.sectionTitle}>{t('loanSummary')}</Text>
                                    <View style={styles.loanSummaryBox}>
                                        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>{t('interestRate')}</Text><Text style={styles.summaryValue}>2.0%</Text></View>
                                        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>{t('repaymentPeriod')}</Text><Text style={styles.summaryValue}>6 {lang === 'en' ? 'Months' : 'నెలలు'}</Text></View>
                                        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>{t('totalRepayment')}</Text><Text style={styles.summaryValue}>₹ {totalRepayment.toFixed(0)}</Text></View>
                                        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>{t('monthlyInstallment')}</Text><Text style={styles.summaryValue}>₹ {monthlyInstallment.toFixed(0)}</Text></View>
                                    </View>

                                    <Text style={styles.sectionTitle}>{t('requiredDocuments')}</Text>
                                    <View style={styles.documentList}>
                                        <MotiPressable onPress={() => setDocuments(d => ({ ...d, aadhaar: !d.aadhaar }))} style={styles.docItem} animate={{ backgroundColor: documents.aadhaar ? '#dcfce7' : '#f3f4f6' }}>
                                            <FontAwesome name={documents.aadhaar ? 'check-circle' : 'circle-o'} size={18} color={documents.aadhaar ? '#16a34a' : '#6b7280'} />
                                            <Text style={styles.docText}>{t('aadhaarCard')}</Text>
                                        </MotiPressable>
                                        <MotiPressable onPress={() => setDocuments(d => ({ ...d, pan: !d.pan }))} style={styles.docItem} animate={{ backgroundColor: documents.pan ? '#dcfce7' : '#f3f4f6' }}>
                                            <FontAwesome name={documents.pan ? 'check-circle' : 'circle-o'} size={18} color={documents.pan ? '#16a34a' : '#6b7280'} />
                                            <Text style={styles.docText}>{t('panCard')}</Text>
                                        </MotiPressable>
                                        {pledgeType !== 'Gold' && (
                                            <MotiPressable onPress={() => setDocuments(d => ({ ...d, ownership: !d.ownership }))} style={styles.docItem} animate={{ backgroundColor: documents.ownership ? '#dcfce7' : '#f3f4f6' }}>
                                                <FontAwesome name={documents.ownership ? 'check-circle' : 'circle-o'} size={18} color={documents.ownership ? '#16a34a' : '#6b7280'} />
                                                <Text style={styles.docText}>{t('assetOwnership')}</Text>
                                            </MotiPressable>
                                        )}
                                    </View>

                                    <MotiPressable onPress={() => setAgreed(!agreed)} style={[styles.docItem, { backgroundColor: agreed ? '#dcfce7' : '#f3f4f6' }]} animate={{ backgroundColor: agreed ? '#dcfce7' : '#f3f4f6' }}>
                                        <FontAwesome name={agreed ? 'check-square-o' : 'square-o'} size={18} color={agreed ? '#16a34a' : '#6b7280'} />
                                        <Text style={styles.docText}>{t('agreeToTerms')}</Text>
                                    </MotiPressable>


                                    <MotiPressable style={{ opacity: (!name || !village || !pledgeType || !agreed) ? 0.6 : 1 }} disabled={!name || !village || !pledgeType || !agreed} onPress={submitInitialDetails} animate={{scale: ({pressed}) => pressed ? 0.95: 1}}>
                                        <LinearGradient colors={[accentColor, '#2563eb']} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.submitButton}><FontAwesome name="whatsapp" color="#fff" size={20} /><Text style={styles.submitButtonText}>{t('sendOnWhatsapp')}</Text></LinearGradient>
                                    </MotiPressable>
                                </MotiView>
                            )}
                        </>
                    ) : (
                        <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.thankYouContainer}>
                            <FontAwesome name="calendar" color={accentColor} size={50} />
                            <Text style={styles.thankYouTitle}>{t('bookVerification')}</Text>
                            {isAfterHours ? (
                                <View style={styles.afterHoursBox}>
                                    <FontAwesome name="exclamation-triangle" color="#f59e0b" size={20} />
                                    <Text style={styles.afterHoursText}>{t('afterHoursMessage')}</Text>
                                    <TouchableOpacity onPress={() => handleWhatsAppChat('Hello, I need customer support.')} style={[styles.newLoanButton, {backgroundColor: '#f59e0b'}]}>
                                        <FontAwesome name="headphones" color="#fff" size={16} />
                                        <Text style={[styles.newLoanButtonText, {color: '#fff'}]}>{t('customerSupport')}</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <>
                                    <Text style={styles.thankYouText}>{t('scheduleDescription')}</Text>
                                    <RNPickerSelect onValueChange={(value) => setScheduleTime(value)} items={timeSlots.map(t => ({label: t, value: t}))} placeholder={{ label: t('selectTime'), value: null }} style={pickerSelectStyles} />
                                    <MotiPressable disabled={!scheduleTime} style={{width: '100%', opacity: !scheduleTime ? 0.6 : 1}} onPress={handleScheduleAppointment} animate={{scale: ({pressed}) => pressed ? 0.95: 1}}>
                                        <LinearGradient colors={[accentColor, '#16a34a']} style={styles.submitButton}><FontAwesome name="clock-o" color="#fff" size={20} /><Text style={styles.submitButtonText}>{t('bookAppointment')}</Text></LinearGradient>
                                    </MotiPressable>
                                </>
                            )}
                        </MotiView>
                    )}
                </BlurView>
            </ScrollView>
        </SafeAreaView>
    );
};

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#111827' },
    container: { flex: 1 },
    contentContainer: { paddingBottom: 40 },
    header: { height: 160, justifyContent: 'center', paddingHorizontal: 20, paddingTop: 40, alignItems: 'center' },
    languageSwitcher: { flexDirection: 'row', position: 'absolute', top: 15, right: 15 },
    langButton: { color: '#fff', paddingHorizontal: 10, opacity: 0.7, fontWeight: '600' },
    langButtonActive: { opacity: 1, textDecorationLine: 'underline' },
    title: { fontSize: 32, fontWeight: 'bold', color: '#fff', textShadowRadius: 2, textShadowColor: 'rgba(0,0,0,0.2)' },
    subtitle: { fontSize: 16, color: '#e0f2fe', marginTop: 5 },
    card: { margin: 15, borderRadius: 20, marginTop: -40, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    confirmationMessage: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#dcfce7', padding: 12, borderRadius: 8, margin: 20, marginBottom: 0 },
    confirmationText: { marginLeft: 10, color: '#166534', fontWeight: '600' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginBottom: 15, marginTop: 10, paddingHorizontal: 20 },
    inputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.5)', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, marginBottom: 15, marginHorizontal: 20 },
    iconWrapper: { width: 20, alignItems: 'center' },
    input: { flex: 1, height: 50, fontSize: 16, color: '#111827', marginLeft: 10 },
    assetGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
    assetButton: { width: (width - 90) / 2, paddingVertical: 20, marginBottom: 10, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 8, alignItems: 'center' },
    assetText: { marginTop: 8, fontWeight: '600', color: '#374151' },
    loanInfoBox: { padding: 15, borderRadius: 8, backgroundColor: 'rgba(243, 244, 246, 0.8)', alignItems: 'center', marginHorizontal: 20 },
    loanLabel: { color: '#4b5563', fontWeight: '500' },
    loanAmount: { fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginTop: 4 },
    submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 8, marginTop: 20, marginHorizontal: 20 },
    submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
    thankYouContainer: { alignItems: 'center', padding: 20 },
    thankYouTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 15, color: '#1f2937' },
    thankYouText: { fontSize: 16, color: '#4b5563', textAlign: 'center', marginVertical: 10 },
    newLoanButton: { marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8 },
    newLoanButtonText: { fontWeight: 'bold', color: '#374151', marginLeft: 8 },
    afterHoursBox: { alignItems: 'center', backgroundColor: '#fffbeb', padding: 15, borderRadius: 8, marginTop: 15, width: '100%' },
    afterHoursText: { color: '#b45309', textAlign: 'center', marginVertical: 10, fontWeight: '500' },
    marketRateBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 8, backgroundColor: '#fef3c7', marginHorizontal: 20, marginTop: 15 },
    loanSummaryBox: { padding: 20, backgroundColor: '#f3f4f6', borderRadius: 10, marginHorizontal: 20, marginBottom: 15 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    summaryLabel: { fontSize: 14, color: '#4b5563' },
    summaryValue: { fontSize: 14, fontWeight: 'bold', color: '#1f2937' },
    documentList: { paddingHorizontal: 20, marginBottom: 15 },
    docItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 8, marginBottom: 10, backgroundColor: '#f3f4f6' },
    docText: { marginLeft: 10, color: '#1f2937', fontWeight: '500' },
});
const pickerSelectStyles = StyleSheet.create({
    inputIOS: { fontSize: 16, paddingVertical: 15, paddingHorizontal: 15, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, color: 'black', paddingRight: 30, backgroundColor: 'rgba(255,255,255,0.5)', marginBottom: 15, marginHorizontal: 20 },
    inputAndroid: { fontSize: 16, paddingHorizontal: 15, paddingVertical: 15, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, color: 'black', paddingRight: 30, backgroundColor: 'rgba(255,255,255,0.5)', marginBottom: 15, marginHorizontal: 20 },
});

export default MoneyLendingScreen;