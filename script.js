// ============================================
// GLOBAL VARIABLES
// ============================================

let allJobs = [];
let selectedTechnicians = [];
let currentFilter = 'all';

const TECHNICIANS = [
    'Yudi', 'Udin', 'Iwan', 'Akmal', 'Arman', 
    'Akbar', 'Hasan', 'Adi', 'Alif', 'External'
];

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 KPI Nala Integrated System Starting...');
    
    // Initialize components
    initializeTabs();
    initializeTechSelector();
    initializeForm();
    initializeDateFields();
    
    // Load initial data
    loadJobsFromKPI();
    loadDatabaseData();
    
    console.log('✅ System initialized successfully');
});

// ============================================
// TAB MANAGEMENT
// ============================================

function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
            
            // Load data based on tab
            if (tabName === 'analytics') {
                updateAnalytics();
            } else if (tabName === 'database') {
                loadDatabaseData();
            } else if (tabName === 'monitor') {
                loadJobsFromKPI();
            }
        });
    });
}

// ============================================
// TECHNICIAN SELECTOR
// ============================================

function initializeTechSelector() {
    const techSelector = document.getElementById('techSelector');
    
    TECHNICIANS.forEach(tech => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tech-btn';
        btn.textContent = `👨‍🔧 ${tech}`;
        btn.dataset.tech = tech;
        
        btn.addEventListener('click', () => {
            if (tech === 'External') {
                if (selectedTechnicians.includes('External')) {
                    selectedTechnicians = selectedTechnicians.filter(t => t !== 'External');
                    btn.classList.remove('selected');
                    document.getElementById('externalInputDiv').style.display = 'none';
                } else {
                    selectedTechnicians.push('External');
                    btn.classList.add('selected');
                    document.getElementById('externalInputDiv').style.display = 'block';
                }
            } else {
                if (selectedTechnicians.includes(tech)) {
                    selectedTechnicians = selectedTechnicians.filter(t => t !== tech);
                    btn.classList.remove('selected');
                } else {
                    selectedTechnicians.push(tech);
                    btn.classList.add('selected');
                }
            }
            
            console.log('Selected technicians:', selectedTechnicians);
        });
        
        techSelector.appendChild(btn);
    });
}

// ============================================
// FORM HANDLING
// ============================================

function initializeForm() {
    const form = document.getElementById('jobForm');
    const waktuMulai = document.getElementById('waktuMulai');
    const waktuSelesai = document.getElementById('waktuSelesai');
    
    // Calculate total time
    function calculateTotalTime() {
        if (waktuMulai.value && waktuSelesai.value) {
            const start = new Date(`2000-01-01 ${waktuMulai.value}`);
            const end = new Date(`2000-01-01 ${waktuSelesai.value}`);
            const diff = (end - start) / 1000 / 60 / 60; // hours
            
            if (diff > 0) {
                const hours = Math.floor(diff);
                const minutes = Math.round((diff - hours) * 60);
                document.getElementById('totalWaktu').value = 
                    `${hours} jam ${minutes} menit`;
            } else {
                document.getElementById('totalWaktu').value = '';
            }
        }
    }
    
    waktuMulai.addEventListener('change', calculateTotalTime);
    waktuSelesai.addEventListener('change', calculateTotalTime);
    
    // Form submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleFormSubmit();
    });
}

function initializeDateFields() {
    const tanggalInput = document.getElementById('tanggal');
    const filterDateInput = document.getElementById('filterDate');
    const today = new Date().toISOString().split('T')[0];
    
    tanggalInput.value = today;
    filterDateInput.value = today;
    
    filterDateInput.addEventListener('change', () => {
        loadJobsFromKPI();
    });
}

// ============================================
// FORM SUBMISSION
// ============================================

async function handleFormSubmit() {
    const saveBtn = document.getElementById('saveBtn');
    
    try {
        // Validate technicians
        if (selectedTechnicians.length === 0) {
            showMessage('⚠️ Pilih minimal 1 teknisi!', true);
            return;
        }
        
        // Validate external name
        if (selectedTechnicians.includes('External')) {
            const externalName = document.getElementById('externalName').value.trim();
            if (!externalName) {
                showMessage('⚠️ Masukkan nama teknisi external!', true);
                return;
            }
        }
        
        // Validate time
        const mulai = document.getElementById('waktuMulai').value;
        const selesai = document.getElementById('waktuSelesai').value;
        
        if (new Date(`2000-01-01 ${selesai}`) <= new Date(`2000-01-01 ${mulai}`)) {
            showMessage('⚠️ Waktu selesai harus lebih besar dari waktu mulai!', true);
            return;
        }
        
        // Build data
        const teknisiList = selectedTechnicians.map(tech => {
            if (tech === 'External') {
                const externalName = document.getElementById('externalName').value.trim();
                return `External (${externalName})`;
            }
            return tech;
        });
        
        const jobData = {
            teknisi: teknisiList.join(', '),
            tanggal: document.getElementById('tanggal').value,
            jasa: document.getElementById('jasa').value,
            waktuMulai: mulai,
            waktuSelesai: selesai,
            totalWaktu: document.getElementById('totalWaktu').value,
            customer: document.getElementById('customer').value.trim(),
            telepon: document.getElementById('telepon').value.trim(),
            alamat: document.getElementById('alamat').value.trim(),
            pemasukan: parseInt(document.getElementById('pemasukan').value) || 0,
            createdAt: new Date().toISOString()
        };
        
        console.log('📝 Submitting data:', jobData);
        
        // Disable button
        saveBtn.disabled = true;
        saveBtn.innerHTML = '💾 MENYIMPAN... <span class="loading"></span>';
        
        // Save to dual database
        const results = await window.firebaseConfig.saveToDualDatabase(jobData);
        
        // Check results
        if (results.kpiDb.success && results.mainDb.success) {
            showMessage('✅ Data berhasil disimpan ke kedua database!', false);
            resetForm();
            loadJobsFromKPI();
            loadDatabaseData();
        } else if (results.kpiDb.success || results.mainDb.success) {
            showMessage('⚠️ Data tersimpan sebagian. Cek koneksi!', true);
            resetForm();
        } else {
            throw new Error('Gagal menyimpan ke kedua database');
        }
        
    } catch (error) {
        console.error('❌ Submit error:', error);
        showMessage('❌ Gagal menyimpan: ' + error.message, true);
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 SIMPAN KE DATABASE (Dual Sync)';
    }
}

function resetForm() {
    document.getElementById('jobForm').reset();
    document.getElementById('tanggal').value = new Date().toISOString().split('T')[0];
    selectedTechnicians = [];
    document.querySelectorAll('.tech-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('externalInputDiv').style.display = 'none';
    document.getElementById('externalName').value = '';
}

// ============================================
// LOAD DATA FROM KPI DATABASE
// ============================================

async function loadJobsFromKPI() {
    try {
        const filterDate = document.getElementById('filterDate').value;
        const jobsList = document.getElementById('jobsList');
        
        jobsList.innerHTML = '<div style="text-align:center; padding:20px;">🔄 Loading...</div>';
        
        const snapshot = await window.firebaseConfig.kpiDb
            .collection('jobs')
            .orderBy('timestamp', 'desc')
            .get();
        
        allJobs = [];
        snapshot.forEach(doc => {
            allJobs.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        // Filter by date
        const filteredJobs = allJobs.filter(job => {
            if (filterDate) {
                return job.tanggal === filterDate;
            }
            return true;
        });
        
        displayJobs(filteredJobs);
        
        console.log(`✅ Loaded ${filteredJobs.length} jobs from KPI database`);
        
    } catch (error) {
        console.error('❌ Load jobs error:', error);
        document.getElementById('jobsList').innerHTML = 
            '<div style="text-align:center; padding:20px; color:red;">❌ Gagal memuat data</div>';
    }
}

function displayJobs(jobs) {
    const jobsList = document.getElementById('jobsList');
    
    if (jobs.length === 0) {
        jobsList.innerHTML = '<div style="text-align:center; padding:20px;">📭 Tidak ada data</div>';
        return;
    }
    
    jobsList.innerHTML = jobs.map(job => `
        <div class="job-card" data-job-id="${job.id}">
            <div class="job-header">
                <div class="job-tech">👨‍🔧 ${job.teknisi || '-'}</div>
                <div class="job-date">📅 ${job.tanggal || '-'}</div>
            </div>
            <div class="job-details">
                <div class="job-detail-item">
                    <strong>🛠️ Jasa:</strong> ${job.jasa || '-'}
                </div>
                <div class="job-detail-item">
                    <strong>👤 Customer:</strong> ${job.customer || '-'}
                </div>
                <div class="job-detail-item">
                    <strong>📞 Telepon:</strong> ${job.telepon || '-'}
                </div>
                <div class="job-detail-item">
                    <strong>⏰ Mulai:</strong> ${job.waktuMulai || '-'}
                </div>
                <div class="job-detail-item">
                    <strong>⏱️ Selesai:</strong> ${job.waktuSelesai || '-'}
                </div>
                <div class="job-detail-item">
                    <strong>⏳ Total:</strong> ${job.totalWaktu || '-'}
                </div>
                <div class="job-detail-item" style="grid-column: 1/-1;">
                    <strong>📍 Alamat:</strong> ${job.alamat || '-'}
                </div>
                <div class="job-detail-item">
                    <strong>💰 Pemasukan:</strong> Rp ${(job.pemasukan || 0).toLocaleString('id-ID')}
                </div>
                <div class="job-detail-item">
                    <strong>🔄 Synced:</strong> ${job.syncedToMainDb ? '✅ Yes' : '⏳ Pending'}
                </div>
            </div>
            <div class="job-actions">
                <button class="action-btn edit-btn" onclick="editJob('${job.id}')">✏️ Edit</button>
                <button class="action-btn delete-btn" onclick="deleteJob('${job.id}')">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

// ============================================
// LOAD DATA FROM MAIN DATABASE
// ============================================

async function loadDatabaseData() {
    try {
        const databaseList = document.getElementById('databaseList');
        databaseList.innerHTML = '<div style="text-align:center; padding:20px;">🔄 Loading from Main Database...</div>';
        
        const snapshot = await window.firebaseConfig.mainDb
            .collection('kpi_teknisi')
            .orderBy('timestamp', 'desc')
            .limit(50)
            .get();
        
        const records = [];
        snapshot.forEach(doc => {
            records.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        document.getElementById('totalRecords').textContent = records.length;
        
        if (records.length === 0) {
            databaseList.innerHTML = '<div style="text-align:center; padding:20px;">📭 Tidak ada data</div>';
            return;
        }
        
        databaseList.innerHTML = records.map(record => `
            <div class="job-card">
                <div class="job-header">
                    <div class="job-tech">👨‍🔧 ${record.teknisi || '-'}</div>
                    <div class="job-date">📅 ${record.tanggal || '-'}</div>
                </div>
                <div class="job-details">
                    <div class="job-detail-item">
                        <strong>🛠️ Jasa:</strong> ${record.jasa || '-'}
                    </div>
                    <div class="job-detail-item">
                        <strong>👤 Customer:</strong> ${record.customer || '-'}
                    </div>
                    <div class="job-detail-item">
                        <strong>💰 Revenue:</strong> Rp ${(record.pemasukan || 0).toLocaleString('id-ID')}
                    </div>
                    <div class="job-detail-item">
                        <strong>📊 Source:</strong> ${record.source || 'kpi_nala'}
                    </div>
                    <div class="job-detail-item">
                        <strong>🔗 KPI ID:</strong> ${record.kpiDbId || '-'}
                    </div>
                    <div class="job-detail-item">
                        <strong>🕐 Synced:</strong> ${record.syncedAt ? new Date(record.syncedAt).toLocaleString('id-ID') : '-'}
                    </div>
                </div>
            </div>
        `).join('');
        
        console.log(`✅ Loaded ${records.length} records from Main Database`);
        
    } catch (error) {
        console.error('❌ Load database error:', error);
        document.getElementById('databaseList').innerHTML = 
            '<div style="text-align:center; padding:20px; color:red;">❌ Gagal memuat data</div>';
    }
}

// Refresh button
document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refreshDb');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadDatabaseData);
    }
});

// ============================================
// ANALYTICS
// ============================================

function updateAnalytics() {
    if (allJobs.length === 0) {
        loadJobsFromKPI().then(() => calculateAnalytics());
    } else {
        calculateAnalytics();
    }
}

function calculateAnalytics() {
    // Total Revenue
    const totalRevenue = allJobs.reduce((sum, job) => sum + (job.pemasukan || 0), 0);
    document.getElementById('totalRevenue').textContent = 
        'Rp ' + totalRevenue.toLocaleString('id-ID');
    
    // Total Jobs
    document.getElementById('totalJobs').textContent = allJobs.length;
    
    // Average Time
    const totalHours = allJobs.reduce((sum, job) => {
        if (job.waktuMulai && job.waktuSelesai) {
            const start = new Date(`2000-01-01 ${job.waktuMulai}`);
            const end = new Date(`2000-01-01 ${job.waktuSelesai}`);
            const hours = (end - start) / 1000 / 60 / 60;
            return sum + hours;
        }
        return sum;
    }, 0);
    const avgHours = allJobs.length > 0 ? (totalHours / allJobs.length).toFixed(1) : 0;
    document.getElementById('avgTime').textContent = avgHours + ' jam';
    
    // Top Technician
    const techCounts = {};
    allJobs.forEach(job => {
        const techs = (job.teknisi || '').split(',').map(t => t.trim());
        techs.forEach(tech => {
            techCounts[tech] = (techCounts[tech] || 0) + 1;
        });
    });
    
    const topTech = Object.entries(techCounts)
        .sort((a, b) => b[1] - a[1])[0];
    
    document.getElementById('topTech').textContent = 
        topTech ? `${topTech[0]} (${topTech[1]} jobs)` : '-';
}

// ============================================
// EDIT & DELETE
// ============================================

async function editJob(jobId) {
    const job = allJobs.find(j => j.id === jobId);
    if (!job) return;
    
    // Populate form
    document.getElementById('tanggal').value = job.tanggal || '';
    document.getElementById('jasa').value = job.jasa || '';
    document.getElementById('waktuMulai').value = job.waktuMulai || '';
    document.getElementById('waktuSelesai').value = job.waktuSelesai || '';
    document.getElementById('customer').value = job.customer || '';
    document.getElementById('telepon').value = job.telepon || '';
    document.getElementById('alamat').value = job.alamat || '';
    document.getElementById('pemasukan').value = job.pemasukan || 0;
    
    // Switch to input tab
    document.querySelector('[data-tab="input"]').click();
    
    showMessage('📝 Data dimuat untuk edit. Update dan simpan kembali.', false);
}

async function deleteJob(jobId) {
    if (!confirm('⚠️ Hapus data ini?')) return;
    
    try {
        // Delete from KPI database
        await window.firebaseConfig.kpiDb.collection('jobs').doc(jobId).delete();
        
        // Find and delete from Main database
        const mainDbSnapshot = await window.firebaseConfig.mainDb
            .collection('kpi_teknisi')
            .where('kpiDbId', '==', jobId)
            .get();
        
        mainDbSnapshot.forEach(async doc => {
            await doc.ref.delete();
        });
        
        showMessage('✅ Data berhasil dihapus dari kedua database', false);
        loadJobsFromKPI();
        loadDatabaseData();
        
    } catch (error) {
        console.error('❌ Delete error:', error);
        showMessage('❌ Gagal menghapus data', true);
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showMessage(message, isError = false) {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;
    messageBox.className = isError ? 'error' : '';
    messageBox.style.display = 'block';
    
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000);
}

// Make functions global
window.editJob = editJob;
window.deleteJob = deleteJob;
