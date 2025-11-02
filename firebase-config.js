// ============================================
// FIREBASE CONFIGURATION - DUAL DATABASE SETUP
// ============================================
// KPI Database & Main Database Nala Integration

// KPI Database Configuration
const kpiFirebaseConfig = {
    apiKey: "AIzaSyDRqVYfBdEkOZ9qYNiIRl8uTnM1stl5lBo",
    authDomain: "kpiteknisi.firebaseapp.com",
    projectId: "kpiteknisi",
    storageBucket: "kpiteknisi.firebasestorage.app",
    messagingSenderId: "61025162198",
    appId: "1:61025162198:web:084518dca837cbaed40a77"
};

// Main Database Nala Configuration
const mainDbFirebaseConfig = {
    apiKey: "AIzaSyBI5T3ZVyHXSRFikTjSlnW9P04cO1UDAwg",
    authDomain: "databasebesar.firebaseapp.com",
    projectId: "databasebesar",
    storageBucket: "databasebesar.firebasestorage.app",
    messagingSenderId: "253231829334",
    appId: "1:253231829334:web:e46fd18ef04b83d6c546f7",
    measurementId: "G-7387ZN5BJG"
};

// Finance Nala Configuration (Optional untuk integrasi bonus/insentif)
const financeFirebaseConfig = {
    apiKey: "AIzaSyASArMgCz6lXELa92V1BFe-5ecY__Seauc",
    authDomain: "financenala.firebaseapp.com",
    databaseURL: "https://financenala-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "financenala",
    storageBucket: "financenala.firebasestorage.app",
    messagingSenderId: "259185907850",
    appId: "1:259185907850:web:7278f2e27f658add34f573",
    measurementId: "G-ZPFH95WW9M"
};

// ============================================
// FIREBASE INITIALIZATION
// ============================================

let kpiApp, kpiDb;
let mainDbApp, mainDb;
let financeApp, financeDb;

// Initialize KPI Firebase
try {
    kpiApp = firebase.initializeApp(kpiFirebaseConfig, 'kpiDatabase');
    kpiDb = kpiApp.firestore();
    console.log('✅ KPI Database connected');
    updateStatus('kpiStatus', '✅ KPI DB', 'connected');
} catch (error) {
    console.error('❌ KPI Database error:', error);
    updateStatus('kpiStatus', '❌ KPI DB', 'error');
}

// Initialize Main Database Nala
try {
    mainDbApp = firebase.initializeApp(mainDbFirebaseConfig, 'mainDatabase');
    mainDb = mainDbApp.firestore();
    console.log('✅ Main Database Nala connected');
    updateStatus('mainDbStatus', '✅ Main DB', 'connected');
} catch (error) {
    console.error('❌ Main Database error:', error);
    updateStatus('mainDbStatus', '❌ Main DB', 'error');
}

// Initialize Finance Database (Optional)
try {
    financeApp = firebase.initializeApp(financeFirebaseConfig, 'financeDatabase');
    financeDb = financeApp.firestore();
    console.log('✅ Finance Database connected (optional)');
} catch (error) {
    console.log('ℹ️ Finance Database not initialized');
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function updateStatus(elementId, text, status) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
        element.className = `status-badge ${status}`;
    }
}

// ============================================
// DUAL SAVE FUNCTION
// ============================================

async function saveToDualDatabase(data) {
    const results = {
        kpiDb: { success: false, id: null, error: null },
        mainDb: { success: false, id: null, error: null }
    };

    // Save to KPI Database
    try {
        const kpiRef = await kpiDb.collection('jobs').add({
            ...data,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            source: 'kpi_nala',
            syncedToMainDb: false
        });
        results.kpiDb.success = true;
        results.kpiDb.id = kpiRef.id;
        console.log('✅ Saved to KPI Database:', kpiRef.id);
    } catch (error) {
        results.kpiDb.error = error.message;
        console.error('❌ KPI Database save failed:', error);
    }

    // Save to Main Database Nala (with additional metadata)
    try {
        const mainDbRef = await mainDb.collection('kpi_teknisi').add({
            ...data,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            source: 'kpi_nala',
            kpiDbId: results.kpiDb.id,
            syncedAt: new Date().toISOString(),
            dataType: 'technician_job',
            // Additional fields for analytics
            month: new Date(data.tanggal).getMonth() + 1,
            year: new Date(data.tanggal).getFullYear(),
            dayOfWeek: new Date(data.tanggal).getDay()
        });
        results.mainDb.success = true;
        results.mainDb.id = mainDbRef.id;
        console.log('✅ Saved to Main Database:', mainDbRef.id);

        // Update KPI database with sync status
        if (results.kpiDb.success) {
            await kpiDb.collection('jobs').doc(results.kpiDb.id).update({
                syncedToMainDb: true,
                mainDbId: mainDbRef.id,
                syncedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    } catch (error) {
        results.mainDb.error = error.message;
        console.error('❌ Main Database save failed:', error);
    }

    return results;
}

// ============================================
// EXPORT CONFIGURATIONS
// ============================================

window.firebaseConfig = {
    kpiApp,
    kpiDb,
    mainDbApp,
    mainDb,
    financeApp,
    financeDb,
    saveToDualDatabase,
    updateStatus
};
