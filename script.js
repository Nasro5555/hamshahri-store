let selectedUC = 0;
let selectedPrice = 0;
let playerInfo = null;

// API Mock برای demo (در واقعیت از PUBG API استفاده کن)
const mockPlayerData = {
    '1234567890123456789': {
        name: 'ProPlayerIR',
        level: 85,
        tier: 'Conqueror',
        kills: '2456',
        avatar: 'https://example.com/avatar1.jpg'
    },
    '9876543210987654321': {
        name: 'PersianKing',
        level: 92,
        tier: 'Ace',
        kills: '3892',
        avatar: 'https://example.com/avatar2.jpg'
    },
    '1111222233334444555': {
        name: 'NoobMaster',
        level: 45,
        tier: 'Crown',
        kills: '892',
        avatar: 'https://example.com/avatar3.jpg'
    }
};

// Buy UC function
function buyUC(uc) {
    selectedUC = uc;
    
    const prices = {
        60: 25000,
        325: 120000,
        660: 220000,
        1800: 550000,
        3875: 1100000,
        6600: 1800000
    };
    
    selectedPrice = prices[uc];
    
    document.getElementById('selectedUC').value = uc + ' UC';
    document.getElementById('selectedPrice').value = selectedPrice.toLocaleString() + ' تومان';
    
    document.getElementById('checkoutModal').style.display = 'block';
    document.getElementById('playerInfoSection').style.display = 'none';
}

// Player ID Check Function (مثل midasbuy)
function checkPlayerId() {
    const playerId = document.getElementById('playerId').value.trim();
    
    if (playerId.length < 16) {
        document.getElementById('playerInfoSection').style.display = 'none';
        return;
    }
    
    // Show loading
    document.getElementById('playerInfoSection').innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <span>در حال بررسی اکانت...</span>
        </div>
    `;
    document.getElementById('playerInfoSection').style.display = 'block';
    
    // Simulate API delay
    setTimeout(() => {
        // Real PUBG API call would be here:
        // fetch(`https://api.pubg.com/players/${playerId}`)
        
        // Mock data for demo
        playerInfo = mockPlayerData[playerId] || null;
        
        if (playerInfo) {
            showPlayerInfo();
        } else {
            showPlayerNotFound();
        }
    }, 1500);
}

// Show player info (مثل midasbuy)
function showPlayerInfo() {
    const playerSection = document.getElementById('playerInfoSection');
    playerSection.innerHTML = `
        <div class="player-card verified">
            <div class="player-header">
                <img src="${playerInfo.avatar}" alt="Avatar" onerror="this.src='https://via.placeholder.com/80x80/667eea/ffffff?text=👤'">
                <div>
                    <h4>${playerInfo.name}</h4>
                    <span class="verified-badge">✅ تأیید شده</span>
                </div>
            </div>
            <div class="player-stats">
                <div class="stat">
                    <span class="stat-label">سطح</span>
                    <span class="stat-value">${playerInfo.level}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">رتبه</span>
                    <span class="stat-value">${playerInfo.tier}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">کُشتن</span>
                    <span class="stat-value">${playerInfo.kills}</span>
                </div>
            </div>
        </div>
    `;
}

// Show not found
function showPlayerNotFound() {
    document.getElementById('playerInfoSection').innerHTML = `
        <div class="player-card error">
            <i class="fas fa-exclamation-triangle"></i>
            <h4>اکانت پیدا نشد!</h4>
            <p>لطفاً Player ID صحیح را وارد کنید</p>
        </div>
    `;
}

// Modal controls
const modals = document.querySelectorAll('.modal');
const closeBtns = document.querySelectorAll('.close');

closeBtns.forEach(btn => {
    btn.onclick = function() {
        modals.forEach(modal => modal.style.display = 'none');
    }
});

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        modals.forEach(modal => modal.style.display = 'none');
    }
}

function closeModals() {
    modals.forEach(modal => modal.style.display = 'none');
}

// Checkout form
document.getElementById('checkoutForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const playerId = document.getElementById('playerId').value;
    const customerName = document.getElementById('customerName').value;
    const phone = document.getElementById('phone').value;
    
    if (!playerId || !customerName || !phone || !playerInfo) {
        alert('لطفا همه اطلاعات را کامل کنید و اکانت معتبر وارد کنید');
        return;
    }
    
    const transactionId = 'TXN' + Date.now();
    document.getElementById('transactionId').textContent = transactionId;
    
    document.getElementById('checkoutModal').style.display = 'none';
    document.getElementById('successModal').style.display = 'block';
    
    document.getElementById('checkoutForm').reset();
    
    console.log('Order data:', {
        playerId,
        playerName: playerInfo.name,
        customerName,
        phone,
        uc: selectedUC,
        price: selectedPrice,
        transactionId
    });
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push({
        id: transactionId,
        playerId,
        playerName: playerInfo.name,
        customerName,
        phone,
        uc: selectedUC,
        price: selectedPrice,
        date: new Date().toLocaleString('fa-IR')
    });
    localStorage.setItem('orders', JSON.stringify(orders));
});

// Real-time Player ID check
document.getElementById('playerId').addEventListener('input', function() {
    const playerId = this.value.trim();
    if (playerId.length >= 16) {
        checkPlayerId();
    } else {
        document.getElementById('playerInfoSection').style.display = 'none';
    }
});

// Smooth scrolling و Header effect (همون قبلی)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255,255,255,0.98)';
    } else {
        header.style.background = 'rgba(255,255,255,0.95)';
    }
});
