/**
 * AuraRing Landing Page Interactive Application Logic
 * Extended with User Portals, Order Returns, Review Appending, and AI Diagnostics
 * Multi-Model Purchasing Integrations (Horizon, Heritage, Pro)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Product Finish Configurations (Hex colors for glow visualization)
    const finishes = {
        stealth: {
            name: "Stealth Black",
            primary: "#8a2be2",    // Violet
            secondary: "#00ffff",  // Cyan
            ringBorder: "#1a1a1a",
            glowColor: "rgba(0, 255, 255, 0.4)"
        },
        nebula: {
            name: "Nebula Glow",
            primary: "#a855f7",    // Purple
            secondary: "#00ffaa",  // Mint Green
            ringBorder: "linear-gradient(135deg, #00ffff, #8a2be2)",
            glowColor: "rgba(0, 255, 170, 0.5)"
        },
        silver: {
            name: "Matte Silver",
            primary: "#718096",    // Slate
            secondary: "#e2e8f0",  // Silver White
            ringBorder: "#cccccc",
            glowColor: "rgba(226, 232, 240, 0.3)"
        },
        gold: {
            name: "Rose Gold",
            primary: "#dd6b20",    // Bronze
            secondary: "#fbd38d",  // Gold/Amber
            ringBorder: "#e5c158",
            glowColor: "rgba(251, 211, 141, 0.4)"
        }
    };

    // Model and Pricing State
    let selectedModel = "Heritage";
    let selectedPrice = "₹29,999 INR";

    // Global Interactive State
    let selectedFinish = 'stealth';
    let selectedSize = null;
    let currentStep = 1;

    // Accounts & Orders States
    let isUserRegistered = false;
    let currentUser = {
        name: "Guest Member",
        email: "guest@auraring.com"
    };

    // Track user session orders
    let orderHistory = [
        {
            id: "AR-2026-48903",
            product: "AuraRing (Stealth Black) • Size 10",
            date: "May 02, 2026",
            status: "delivered",
            canReturn: true
        }
    ];

    /* ==========================================================================
       1. Customizer Finish Switcher Logic (Hero Widget)
       ========================================================================== */
    const swatches = document.querySelectorAll('.swatch');
    const finishLabel = document.getElementById('finish-text');

    function applyThemeColors(finishKey) {
        const theme = finishes[finishKey];
        if (!theme) return;

        document.documentElement.style.setProperty('--primary', theme.primary);
        document.documentElement.style.setProperty('--secondary', theme.secondary);
        
        const ringGlow = document.querySelector('.glow-ring-inner');
        if (ringGlow) {
            if (finishKey === 'nebula') {
                ringGlow.style.background = theme.ringBorder;
                ringGlow.style.border = "none";
                ringGlow.style.padding = "16px";
            } else {
                ringGlow.style.background = "none";
                ringGlow.style.border = `16px solid ${theme.ringBorder}`;
                ringGlow.style.padding = "0";
            }
            ringGlow.style.boxShadow = `0 0 45px ${theme.glowColor}`;
        }
    }

    swatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            swatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            
            selectedFinish = swatch.getAttribute('data-finish');
            finishLabel.textContent = finishes[selectedFinish].name;

            applyThemeColors(selectedFinish);
            syncModalFinishSelection(selectedFinish);
        });
    });


    /* ==========================================================================
       2. Hamburger Menu Drawer Navigation (Mobile)
       ========================================================================== */
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function toggleMenu() {
        hamburgerBtn.classList.toggle('active');
        mobileDrawer.classList.toggle('active');
        drawerOverlay.classList.toggle('active');
        document.body.style.overflow = mobileDrawer.classList.contains('active') ? 'hidden' : '';
    }

    hamburgerBtn.addEventListener('click', toggleMenu);
    drawerOverlay.addEventListener('click', toggleMenu);

    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileDrawer.classList.contains('active')) {
                toggleMenu();
            }
        });
    });


    /* ==========================================================================
       3. Scroll-to-Top Button
       ========================================================================== */
    const scrollTopBtn = document.getElementById('scroll-top-btn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    /* ==========================================================================
       4. Technical Specifications Tab controls
       ========================================================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const specPanels = document.querySelectorAll('.specs-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            specPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetPanelId = `tab-${btn.getAttribute('data-tab')}`;
            document.getElementById(targetPanelId).classList.add('active');
        });
    });


    /* ==========================================================================
       5. Scroll Spy Navigation Highlight
       ========================================================================== */
    const navLinks = document.querySelectorAll('.nav-links li a');
    const sections = document.querySelectorAll('section');

    function scrollSpy() {
        let currentSectionId = 'hero';
        const scrollPosition = window.scrollY + 150; // offset

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', scrollSpy);


    /* ==========================================================================
       6. Interactive Mouse Glow (Features Cards)
       ========================================================================== */
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });


    /* ==========================================================================
       6b. Pricing Card Swatch Selector Logic
       ========================================================================== */
    const pricingSwatches = document.querySelectorAll('.pricing-swatch');

    pricingSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            // Find parent card
            const parentCard = swatch.closest('.pricing-card');
            const siblingSwatches = parentCard.querySelectorAll('.pricing-swatch');
            const labelNode = parentCard.querySelector('.pricing-swatch-label');

            siblingSwatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');

            const finishKey = swatch.getAttribute('data-finish');
            labelNode.textContent = `${finishes[finishKey].name} finish`;
            labelNode.style.color = finishes[finishKey].secondary;
        });
    });


    /* ==========================================================================
       7. Multi-step Pre-Order Modal Logic
       ========================================================================== */
    const preorderModal = document.getElementById('preorder-modal');
    const openPreorderBtns = document.querySelectorAll('.open-preorder-btn');
    const buyModelBtns = document.querySelectorAll('.buy-model-btn');
    const closePreorderBtn = document.getElementById('modal-close');
    
    const stepPanels = document.querySelectorAll('.config-step-panel');
    const stepDots = document.querySelectorAll('.step-dot');
    const configStepDesc = document.getElementById('config-step-desc');

    const nextBtn1 = document.getElementById('next-btn-1');
    const nextBtn2 = document.getElementById('next-btn-2');
    const backBtn2 = document.getElementById('back-btn-2');
    const backBtn3 = document.getElementById('back-btn-3');
    const receiptCloseBtn = document.getElementById('receipt-close-btn');

    const sizeBtns = document.querySelectorAll('.size-btn');
    const checkoutForm = document.getElementById('preorder-checkout-form');
    const optionCards = document.querySelectorAll('.modal-finish-option');

    const modalSummaryFinish = document.getElementById('modal-summary-finish');
    const modalSummarySize = document.getElementById('modal-summary-size');
    const modalSummaryModel = document.getElementById('modal-summary-model');
    const modalSummaryPrice = document.getElementById('modal-summary-price');

    // Clicking buy buttons triggers modal with dynamic configurations
    buyModelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedModel = btn.getAttribute('data-model');
            selectedPrice = btn.getAttribute('data-price');
            
            // Sync active finish matching the card's active swatch
            const parentCard = btn.closest('.pricing-card');
            const activeSwatch = parentCard.querySelector('.pricing-swatch.active');
            selectedFinish = activeSwatch ? activeSwatch.getAttribute('data-finish') : 'stealth';

            openConfigurator(selectedModel, selectedPrice, selectedFinish);
        });
    });

    // Main header preorder button fallback default (Heritage)
    openPreorderBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Check if it's not a buy-model button itself
            if (!btn.classList.contains('buy-model-btn')) {
                selectedModel = "Heritage";
                selectedPrice = "₹29,999 INR";
                selectedFinish = "stealth";
                openConfigurator(selectedModel, selectedPrice, selectedFinish);
            }
        });
    });

    function openConfigurator(model, price, finish) {
        if (mobileDrawer.classList.contains('active')) {
            toggleMenu();
        }

        // Fill pricing panels
        modalSummaryModel.textContent = `AuraRing ${model}`;
        modalSummaryPrice.textContent = price;
        document.getElementById('receipt-price-val').textContent = price;

        // Hide/Show finishes depending on available options for Horizon/Heritage/Pro
        optionCards.forEach(card => {
            const finishOpt = card.getAttribute('data-finish');
            card.style.display = 'flex'; // show all initially

            // Horizon limit stealth & silver
            if (model.toLowerCase().includes('horizon')) {
                if (finishOpt === 'nebula' || finishOpt === 'gold') {
                    card.style.display = 'none';
                }
            } 
            // Heritage limit stealth, silver, & nebula
            else if (model.toLowerCase().includes('heritage')) {
                if (finishOpt === 'gold') {
                    card.style.display = 'none';
                }
            }
        });

        // Set selected finish active state
        selectedFinish = finish;
        syncModalFinishSelection(selectedFinish);
        applyThemeColors(selectedFinish);

        preorderModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        goToStep(1);
    }

    function closeModal() {
        preorderModal.classList.remove('active');
        document.body.style.overflow = '';
        resetModalData();
    }

    closePreorderBtn.addEventListener('click', closeModal);
    receiptCloseBtn.addEventListener('click', closeModal);

    preorderModal.addEventListener('click', (e) => {
        if (e.target === preorderModal) {
            closeModal();
        }
    });

    optionCards.forEach(card => {
        card.addEventListener('click', () => {
            optionCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            selectedFinish = card.getAttribute('data-finish');
            syncModalFinishSelection(selectedFinish);
            applyThemeColors(selectedFinish);
            
            // Sync swatch in hero customizer
            swatches.forEach(swatch => {
                if (swatch.getAttribute('data-finish') === selectedFinish) {
                    swatches.forEach(s => s.classList.remove('active'));
                    swatch.classList.add('active');
                    finishLabel.textContent = finishes[selectedFinish].name;
                }
            });
        });
    });

    function syncModalFinishSelection(finishKey) {
        const finishData = finishes[finishKey];
        modalSummaryFinish.textContent = `${finishData.name} Finish`;
        
        optionCards.forEach(card => {
            if (card.getAttribute('data-finish') === finishKey) {
                optionCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            }
        });
    }

    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            selectedSize = btn.getAttribute('data-size');
            modalSummarySize.textContent = `US ${selectedSize}`;
            
            nextBtn2.classList.remove('disabled');
            nextBtn2.removeAttribute('disabled');
            nextBtn2.textContent = `Continue with Size US ${selectedSize}`;
        });
    });

    function goToStep(stepNum) {
        currentStep = stepNum;
        stepPanels.forEach(panel => panel.classList.remove('active'));
        document.getElementById(`step-panel-${stepNum}`).classList.add('active');

        stepDots.forEach(dot => {
            const dotStep = parseInt(dot.getAttribute('data-step'));
            dot.classList.remove('active', 'completed');
            if (dotStep === stepNum) {
                dot.classList.add('active');
            } else if (dotStep < stepNum) {
                dot.classList.add('completed');
            }
        });

        switch(stepNum) {
            case 1: configStepDesc.textContent = "Step 1: Choose your finish style"; break;
            case 2: configStepDesc.textContent = "Step 2: Select your ring finger size"; break;
            case 3: configStepDesc.textContent = "Step 3: Secure your shipping priority details"; break;
            case 4: configStepDesc.textContent = "Configuration Saved"; break;
        }
    }

    nextBtn1.addEventListener('click', () => goToStep(2));
    nextBtn2.addEventListener('click', () => {
        if (selectedSize) goToStep(3);
    });
    
    backBtn2.addEventListener('click', () => goToStep(1));
    backBtn3.addEventListener('click', () => goToStep(2));

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const randomOrderId = "AR-2026-" + Math.floor(100000 + Math.random() * 900000);
        const userEmail = document.getElementById('checkout-email').value;

        document.getElementById('receipt-order-id').textContent = randomOrderId;
        const productName = `AuraRing ${selectedModel} (${finishes[selectedFinish].name}) • Size ${selectedSize}`;
        document.getElementById('receipt-product').textContent = `AuraRing - ${selectedModel} (${finishes[selectedFinish].name})`;
        document.getElementById('receipt-size').textContent = `US Size ${selectedSize}`;

        // Insert new order to history
        const newOrder = {
            id: randomOrderId,
            product: productName,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }),
            status: "pre-ordered",
            canReturn: true
        };
        orderHistory.push(newOrder);

        // Update dashboard orders list
        renderOrdersList();

        goToStep(4);
    });

    function resetModalData() {
        selectedSize = null;
        modalSummarySize.textContent = "Unselected";
        sizeBtns.forEach(btn => btn.classList.remove('active'));
        nextBtn2.classList.add('disabled');
        nextBtn2.setAttribute('disabled', 'true');
        nextBtn2.textContent = "Choose Size to Continue";
        checkoutForm.reset();
    }


    /* ==========================================================================
       8. AuraPortal Account Dashboard Controls
       ========================================================================== */
    const portalModal = document.getElementById('aura-portal-modal');
    const portalOpenBtn = document.getElementById('portal-open-btn');
    const mobilePortalOpen = document.getElementById('mobile-portal-open');
    const portalCloseBtn = document.getElementById('portal-close');

    // Registration Elements
    const regForm = document.getElementById('portal-registration-form');
    const portalPanelAuth = document.getElementById('portal-panel-auth');
    const portalPanelProfile = document.getElementById('portal-panel-profile');
    const portalNavItems = document.querySelectorAll('.portal-menu-item');
    const portalPanels = document.querySelectorAll('.portal-panel');

    const portalUserName = document.getElementById('portal-user-name');
    const portalUserEmail = document.getElementById('portal-user-email');
    const portalAvatar = document.getElementById('portal-avatar');
    const portalSignoutTrigger = document.getElementById('portal-signout-trigger');

    function openPortal() {
        if (mobileDrawer.classList.contains('active')) {
            toggleMenu();
        }
        portalModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (!isUserRegistered) {
            showPortalPanel('auth');
            portalNavItems.forEach(item => item.style.opacity = '0.3');
        } else {
            showPortalPanel('profile');
            portalNavItems.forEach(item => item.style.opacity = '1');
        }
    }

    portalOpenBtn.addEventListener('click', openPortal);
    if (mobilePortalOpen) {
        mobilePortalOpen.addEventListener('click', (e) => {
            e.preventDefault();
            openPortal();
        });
    }

    function closePortal() {
        portalModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    portalCloseBtn.addEventListener('click', closePortal);
    portalModal.addEventListener('click', (e) => {
        if (e.target === portalModal) {
            closePortal();
        }
    });

    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameVal = document.getElementById('reg-name').value;
        const emailVal = document.getElementById('reg-email').value;

        currentUser.name = nameVal;
        currentUser.email = emailVal;
        isUserRegistered = true;

        portalUserName.textContent = currentUser.name;
        portalUserEmail.textContent = currentUser.email;
        portalAvatar.textContent = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

        portalNavItems.forEach(item => item.style.opacity = '1');
        showPortalPanel('profile');

        portalNavItems.forEach(item => item.classList.remove('active'));
        document.querySelector('.portal-menu-item[data-panel="profile"]').classList.add('active');
    });

    portalSignoutTrigger.addEventListener('click', () => {
        isUserRegistered = false;
        currentUser = { name: "Guest Member", email: "guest@auraring.com" };

        portalUserName.textContent = currentUser.name;
        portalUserEmail.textContent = currentUser.email;
        portalAvatar.textContent = "G";

        showPortalPanel('auth');
        portalNavItems.forEach(item => {
            item.classList.remove('active');
            item.style.opacity = '0.3';
        });
    });

    portalNavItems.forEach(item => {
        item.addEventListener('click', () => {
            if (!isUserRegistered) return;

            portalNavItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const targetPanelKey = item.getAttribute('data-panel');
            showPortalPanel(targetPanelKey);
        });
    });

    function showPortalPanel(panelKey) {
        portalPanels.forEach(panel => panel.classList.remove('active'));
        
        if (panelKey === 'orders') {
            document.getElementById('returns-wizard').style.display = 'none';
            document.getElementById('portal-orders-list').style.display = 'flex';
        }

        document.getElementById(`portal-panel-${panelKey}`).classList.add('active');
    }


    /* ==========================================================================
       9. Portal Order History & Return Request Wizard Flow
       ========================================================================== */
    const ordersListContainer = document.getElementById('portal-orders-list');
    const returnsWizard = document.getElementById('returns-wizard');
    const returnTargetProduct = document.getElementById('return-target-product');
    const returnTargetId = document.getElementById('return-target-id');
    const cancelReturnBtn = document.getElementById('cancel-return-btn');

    const confirmReturnBtn = document.getElementById('confirm-return-reasons');
    const completeReturnBtn = document.getElementById('complete-return-wizard');
    const returnStep1 = document.getElementById('return-step-1');
    const returnStep2 = document.getElementById('return-step-2');
    const returnReasonSelect = document.getElementById('return-reason');
    const returnSizeRow = document.getElementById('return-size-exchange-row');

    let activeReturningOrderId = null;

    returnReasonSelect.addEventListener('change', () => {
        if (returnReasonSelect.value === 'wrong-size') {
            returnSizeRow.style.display = 'block';
        } else {
            returnSizeRow.style.display = 'none';
        }
    });

    function renderOrdersList() {
        ordersListContainer.innerHTML = '';
        
        if (orderHistory.length === 0) {
            ordersListContainer.innerHTML = '<p class="text-align-center" style="color: var(--text-secondary); margin-top:20px;">No orders found.</p>';
            return;
        }

        orderHistory.forEach(order => {
            const row = document.createElement('div');
            row.className = 'order-card-row';
            row.id = `order-${order.id}`;
            
            let badgeClass = 'delivered';
            let badgeText = 'Delivered';
            if (order.status === 'pre-ordered') {
                badgeClass = 'pre-ordered';
                badgeText = 'Pre-ordered';
            } else if (order.status === 'return-requested') {
                badgeClass = 'return-requested';
                badgeText = 'Return Requested';
            }

            const returnButtonHTML = order.status !== 'return-requested' 
                ? `<button class="order-action-btn return-trigger-btn" data-order-id="${order.id}" data-product="${order.product}">Request Return</button>`
                : `<span style="font-size:12px; color:var(--text-secondary);">Processing Return</span>`;

            row.innerHTML = `
                <div class="order-left-info">
                    <strong>Order ID: ${order.id}</strong>
                    <span>Product: ${order.product}</span>
                    <span class="order-date">Purchased: ${order.date}</span>
                </div>
                <div class="order-right-actions">
                    <span class="order-status-badge ${badgeClass}">${badgeText}</span>
                    ${returnButtonHTML}
                </div>
            `;
            
            ordersListContainer.appendChild(row);
        });

        document.querySelectorAll('.return-trigger-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                activeReturningOrderId = btn.getAttribute('data-order-id');
                const productTitle = btn.getAttribute('data-product');

                ordersListContainer.style.display = 'none';
                returnsWizard.style.display = 'block';

                returnTargetProduct.textContent = productTitle;
                returnTargetId.textContent = activeReturningOrderId;

                returnStep1.classList.add('active');
                returnStep2.classList.remove('active');
                returnReasonSelect.value = 'wrong-size';
                returnSizeRow.style.display = 'block';
            });
        });
    }

    cancelReturnBtn.addEventListener('click', () => {
        returnsWizard.style.display = 'none';
        ordersListContainer.style.display = 'flex';
    });

    confirmReturnBtn.addEventListener('click', () => {
        returnStep1.classList.remove('active');
        returnStep2.classList.add('active');
    });

    completeReturnBtn.addEventListener('click', () => {
        const orderObj = orderHistory.find(o => o.id === activeReturningOrderId);
        if (orderObj) {
            orderObj.status = 'return-requested';
        }

        returnsWizard.style.display = 'none';
        ordersListContainer.style.display = 'flex';
        renderOrdersList();
    });

    renderOrdersList();


    /* ==========================================================================
       10. User Review Form Submission & Live Review Card Appender
       ========================================================================== */
    const writeReviewTrigger = document.getElementById('write-review-trigger');
    const reviewStarSelect = document.getElementById('rating-star-selector');
    const reviewForm = document.getElementById('portal-review-form');
    const reviewStarsValue = document.getElementById('review-stars-value');
    const reviewsList = document.getElementById('reviews-list');
    const reviewFormFeedback = document.getElementById('review-form-feedback');

    writeReviewTrigger.addEventListener('click', () => {
        openPortal();
        if (isUserRegistered) {
            showPortalPanel('add-review');
            portalNavItems.forEach(i => i.classList.remove('active'));
            document.querySelector('.portal-menu-item[data-panel="add-review"]').classList.add('active');
        }
    });

    const starNodes = document.querySelectorAll('.star-input');
    starNodes.forEach(star => {
        star.addEventListener('click', () => {
            const ratingVal = parseInt(star.getAttribute('data-rating'));
            reviewStarsValue.value = ratingVal;

            starNodes.forEach((s, idx) => {
                if (idx < ratingVal) {
                    s.innerHTML = '&#9733;';
                    s.classList.add('active');
                } else {
                    s.innerHTML = '&#9734;';
                    s.classList.remove('active');
                }
            });
        });
    });

    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const ratingVal = parseInt(reviewStarsValue.value);
        const titleVal = document.getElementById('review-title').value;
        const commentsVal = document.getElementById('review-comments').value;

        let starsStr = '';
        for (let i = 1; i <= 5; i++) {
            starsStr += (i <= ratingVal) ? '&#9733;' : '&#9734;';
        }

        const newReviewItem = document.createElement('div');
        newReviewItem.className = 'review-item';
        newReviewItem.innerHTML = `
            <div class="review-header">
                <div class="user-meta">
                    <strong>${currentUser.name}</strong>
                    <span class="verified-buyer">Verified Buyer</span>
                </div>
                <span class="review-date">Today</span>
            </div>
            <div class="item-stars" style="color: #ffd700;">${starsStr}</div>
            <p class="review-body"><strong>${titleVal}</strong> - ${commentsVal}</p>
        `;

        reviewsList.prepend(newReviewItem);

        reviewFormFeedback.textContent = "Review published live on landing page successfully!";
        reviewForm.reset();

        starNodes.forEach(s => {
            s.innerHTML = '&#9733;';
            s.classList.add('active');
        });
        reviewStarsValue.value = 5;

        setTimeout(() => {
            closePortal();
            reviewFormFeedback.textContent = '';
            
            document.getElementById('ratings-section').scrollIntoView({
                behavior: 'smooth'
            });
        }, 1500);
    });


    /* ==========================================================================
       11. AuraAI Collapsible Assistant & Interactive Chat Bot Console
       ========================================================================== */
    const aiBubbleBtn = document.getElementById('ai-bubble-btn');
    const aiDrawer = document.getElementById('ai-drawer');
    const aiDrawerClose = document.getElementById('ai-drawer-close');
    const aiTabs = document.querySelectorAll('.ai-tab-btn');
    const aiTabContents = document.querySelectorAll('.ai-tab-content');

    const aiChatLog = document.getElementById('ai-chat-log');
    const aiChatInputForm = document.getElementById('ai-chat-input-form');
    const aiUserMessageInput = document.getElementById('ai-user-message-input');

    aiBubbleBtn.addEventListener('click', () => {
        aiDrawer.classList.toggle('active');
    });

    aiDrawerClose.addEventListener('click', () => {
        aiDrawer.classList.remove('active');
    });

    aiTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            aiTabs.forEach(t => t.classList.remove('active'));
            aiTabContents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const targetContentId = `aitab-${tab.getAttribute('data-aitab')}`;
            document.getElementById(targetContentId).classList.add('active');
        });
    });

    function appendChatMessage(sender, text) {
        const bubble = document.createElement('div');
        bubble.className = `ai-message ${sender}`;
        bubble.innerHTML = `<p>${text}</p>`;
        aiChatLog.appendChild(bubble);
        aiChatLog.scrollTop = aiChatLog.scrollHeight;
    }

    function streamBotMessage(responseText) {
        const bubble = document.createElement('div');
        bubble.className = 'ai-message bot';
        
        bubble.innerHTML = `
            <div class="typing-indicator" style="display:flex; gap: 4px; padding: 4px 0;">
                <span style="width:6px; height:6px; border-radius:50%; background:#777; animation: bounceDot 1.4s infinite 0.2s;"></span>
                <span style="width:6px; height:6px; border-radius:50%; background:#777; animation: bounceDot 1.4s infinite 0.4s;"></span>
                <span style="width:6px; height:6px; border-radius:50%; background:#777; animation: bounceDot 1.4s infinite 0.6s;"></span>
            </div>
        `;
        aiChatLog.appendChild(bubble);
        aiChatLog.scrollTop = aiChatLog.scrollHeight;

        setTimeout(() => {
            bubble.innerHTML = '';
            const textPara = document.createElement('p');
            bubble.appendChild(textPara);

            let charIdx = 0;
            function typeChar() {
                if (charIdx < responseText.length) {
                    textPara.innerHTML += responseText.charAt(charIdx);
                    charIdx++;
                    aiChatLog.scrollTop = aiChatLog.scrollHeight;
                    setTimeout(typeChar, 15);
                }
            }
            typeChar();
        }, 800);
    }

    aiChatInputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userMsg = aiUserMessageInput.value;
        appendChatMessage('user', userMsg);
        aiUserMessageInput.value = '';

        const normalizedMsg = userMsg.toLowerCase();
        let reply = '';

        if (normalizedMsg.includes('battery') || normalizedMsg.includes('charge') || normalizedMsg.includes('power')) {
            reply = "AuraRing contains a 22mAh custom battery giving 7 full days of tracking on a single charge. Recharging uses wireless NFC induction and takes roughly 50 minutes to go from 20% to 100%.";
        } else if (normalizedMsg.includes('size') || normalizedMsg.includes('sizing') || normalizedMsg.includes('finger') || normalizedMsg.includes('fit')) {
            reply = "We support US Sizes 6 through 12. If you are unsure of your size, please open the 'Finger Scan' tab in this assistant to auto-calculate your size using your phone camera, or choose a size US 8 pre-order, which automatically includes a free physical sizing kit sent to your home!";
        } else if (normalizedMsg.includes('sensor') || normalizedMsg.includes('track') || normalizedMsg.includes('sleep') || normalizedMsg.includes('heart') || normalizedMsg.includes('temperature') || normalizedMsg.includes('oxygen')) {
            reply = "AuraRing tracks continuous heart rate, heart rate variability (HRV), blood oxygen (SpO2), and skin temperature using high-accuracy medical-grade LEDs and infrared photoplethysmography sensors aligned to your index finger.";
        } else if (normalizedMsg.includes('material') || normalizedMsg.includes('water') || normalizedMsg.includes('scratch') || normalizedMsg.includes('titanium')) {
            reply = "The ring chassis is crafted with Grade 5 Fighter-grade Aerospace Titanium and coated with a scratch-resistant Diamond-like Carbon (DLC). It is fully IP68 rated, allowing waterproof protection up to 100m (330ft).";
        } else if (normalizedMsg.includes('price') || normalizedMsg.includes('buy') || normalizedMsg.includes('cost') || normalizedMsg.includes('rupee') || normalizedMsg.includes('inr') || normalizedMsg.includes('rate')) {
            reply = "AuraRing pricing is in Indian Rupees: Horizon Essential (₹24,999 INR), Heritage Edition (₹29,999 INR), and Stealth Pro VIP Bundle (₹34,999 INR). We guarantee original Grade-5 titanium and certified biosensors when purchased here. Click the 'Shop' link in the navbar to order.";
        } else if (normalizedMsg.includes('about') || normalizedMsg.includes('story') || normalizedMsg.includes('company') || normalizedMsg.includes('vision') || normalizedMsg.includes('find')) {
            reply = "AuraRing was founded in 2024 by biomedical engineers and designers. You can find detailed info under the 'About' section on our homepage, which details our research into cardiovascular tracking, our custom 7-day battery, and aerospace Grade 5 titanium chassis.";
        } else if (normalizedMsg.includes('fake') || normalizedMsg.includes('copy') || normalizedMsg.includes('copies') || normalizedMsg.includes('budget') || normalizedMsg.includes('cheap') || normalizedMsg.includes('other platform') || normalizedMsg.includes('real')) {
            reply = "To purchase with full confidence: our platform sells 100% original AuraRings with a 2-Year warranty. Low-budget copies on other sites look real in photos but use heavy toxic lead/zinc alloys (causing skin allergies), fake flashing green LEDs with zero sensors, and cheap batteries that overheat. Please review our 'Trust' comparison section to see original vs. budget fake product specs.";
        } else {
            reply = "AuraRing tracks sleep staging, activity calorie burn, and HRV recovery seamlessly. You can sync metrics with Apple Health and Google Fit via the AuraCompanion app. Ask me about original quality vs cheap copies, Indian Rupee rates, sizing, or health sensors!";
        }

        streamBotMessage(reply);
    });


    /* ==========================================================================
       12. Finger Scanner Image Mock-Uploader & Sizer Diagnostics
       ========================================================================== */
    const scannerDropzone = document.getElementById('scanner-upload-area');
    const scannerFilePicker = document.getElementById('scanner-file-picker');
    const scannerPreviewBox = document.getElementById('scanner-preview-box');
    const scannerImagePreview = document.getElementById('scanner-image-preview');
    const scannerResults = document.getElementById('scanner-results');

    scannerDropzone.addEventListener('click', () => {
        scannerFilePicker.click();
    });

    scannerFilePicker.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                scannerDropzone.style.display = 'none';
                scannerPreviewBox.style.display = 'flex';
                scannerResults.style.display = 'none';
                scannerImagePreview.src = event.target.result;

                setTimeout(() => {
                    scannerPreviewBox.style.display = 'none';
                    scannerResults.style.display = 'block';

                    scannerResults.innerHTML = `
                        <div class="result-card-header">
                            <h5>Aura Scan Diagnostics</h5>
                        </div>
                        <div class="result-metrics-list">
                            <div class="result-metric-item">
                                <span>Reference Ratio:</span>
                                <strong>85.4% card ratio</strong>
                            </div>
                            <div class="result-metric-item">
                                <span>Calculated Size:</span>
                                <strong>US Size 9</strong>
                            </div>
                            <div class="result-metric-item">
                                <span>Confidence Rating:</span>
                                <strong style="color: #00ff88;">94% Accuracy</strong>
                            </div>
                        </div>
                        <div class="result-note-box">
                            We recommend choosing a size 9. Sync these results in the pre-order modal for direct checkout configuration.
                        </div>
                        <button class="order-action-btn" id="scanner-retry-btn" style="margin-top: 15px; width: 100%;">Upload Another Photo</button>
                    `;

                    document.getElementById('scanner-retry-btn').addEventListener('click', () => {
                        scannerDropzone.style.display = 'flex';
                        scannerResults.style.display = 'none';
                        scannerFilePicker.value = '';
                    });

                }, 2500);
            };
            
            reader.readAsDataURL(e.target.files[0]);
        }
    });


    /* ==========================================================================
       13. Health Report Document Analyzer Logic (CSV/PDF)
       ========================================================================== */
    const analyzerDropzone = document.getElementById('analyzer-upload-area');
    const analyzerFilePicker = document.getElementById('analyzer-file-picker');
    const analyzerLoader = document.getElementById('analyzer-loader');
    const analyzerResults = document.getElementById('analyzer-results');

    analyzerDropzone.addEventListener('click', () => {
        analyzerFilePicker.click();
    });

    analyzerFilePicker.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            analyzerDropzone.style.display = 'none';
            analyzerLoader.style.display = 'flex';
            analyzerResults.style.display = 'none';

            setTimeout(() => {
                analyzerLoader.style.display = 'none';
                analyzerResults.style.display = 'block';

                analyzerResults.innerHTML = `
                    <div class="result-card-header">
                        <h5>AuraAI Health Diagnostics</h5>
                    </div>
                    <div class="result-metrics-list">
                        <div class="result-metric-item">
                            <span>Diagnostic Score:</span>
                            <strong>84 / 100 (Optimal)</strong>
                        </div>
                        <div class="result-metric-item">
                            <span>Deep Sleep Ratio:</span>
                            <strong>22% (Excellent)</strong>
                        </div>
                        <div class="result-metric-item">
                            <span>HRV Median:</span>
                            <strong>68 ms</strong>
                        </div>
                        <div class="result-metric-item">
                            <span>Resting Heart Rate:</span>
                            <strong>54 bpm (Stable)</strong>
                        </div>
                    </div>
                    <div class="result-note-box">
                        <strong>AI Recommendation:</strong> Cardio-readiness is high. Optimal sleep staging achieved. Keep sleeping 15 minutes earlier to hit target HRV goals.
                    </div>
                    <button class="order-action-btn" id="analyzer-retry-btn" style="margin-top: 15px; width: 100%;">Analyze Another Document</button>
                `;

                document.getElementById('analyzer-retry-btn').addEventListener('click', () => {
                    analyzerDropzone.style.display = 'flex';
                    analyzerResults.style.display = 'none';
                    analyzerFilePicker.value = '';
                });

            }, 2500);
        }
    });

    /* ==========================================================================
       14. Newsletter Priority Form Submission Handler
       ========================================================================== */
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterFeedback = document.getElementById('newsletter-feedback');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('contact-email');
            
            newsletterFeedback.classList.remove('success');
            newsletterFeedback.style.color = '#00ffff';
            newsletterFeedback.textContent = "Registering subscription...";

            setTimeout(() => {
                newsletterFeedback.classList.add('success');
                newsletterFeedback.textContent = `Access granted! early details sent to: ${emailInput.value}`;
                emailInput.value = '';
            }, 1000);
        });
    }

    /* ==========================================================================
       15. AuraSync Lab - 3D Ring Rotation & Live Diagnostics Simulator
       ========================================================================== */
    const labRingStage = document.getElementById('lab-ring-stage');
    const labRing3d = document.getElementById('lab-ring-3d');
    const labSwatches = document.querySelectorAll('.lab-swatch');
    
    // 3D Mouse Rotation logic
    if (labRingStage && labRing3d) {
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let currentRotationY = 0;
        let currentRotationX = -10;

        // Hover effect for subtle rotation
        labRingStage.addEventListener('mousemove', (e) => {
            if (isDragging) return;
            const rect = labRingStage.getBoundingClientRect();
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);
            
            // Map offsets to rotation bounds
            const rotY = (x / (rect.width / 2)) * 60; // Max 60deg
            const rotX = (y / (rect.height / 2)) * -30; // Max 30deg
            
            labRing3d.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg)`;
        });

        // Reset rotation on mouse leave
        labRingStage.addEventListener('mouseleave', () => {
            if (isDragging) return;
            labRing3d.style.transform = `rotateY(0deg) rotateX(-10deg)`;
        });

        // Drag to rotate logic
        labRingStage.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            labRingStage.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            currentRotationY += deltaX * 0.5;
            currentRotationX -= deltaY * 0.5;
            
            // Limit rotation bounds for X
            currentRotationX = Math.max(-60, Math.min(60, currentRotationX));
            
            labRing3d.style.transform = `rotateY(${currentRotationY}deg) rotateX(${currentRotationX}deg)`;
            
            startX = e.clientX;
            startY = e.clientY;
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                labRingStage.style.cursor = 'grab';
            }
        });
    }

    // 3D Ring Customizer finish sync
    labSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            labSwatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');

            const finishKey = swatch.getAttribute('data-finish');
            const colorHex = finishes[finishKey].primary;
            const borderGlow = finishes[finishKey].glowColor;

            // Apply to 3D Ring
            const outerFace = document.querySelector('.ring-face.outer');
            if (outerFace) {
                outerFace.style.borderColor = colorHex;
                outerFace.style.boxShadow = `inset 0 0 15px rgba(0,0,0,0.9), 0 0 20px ${borderGlow}`;
            }

            // Sync with main customizer
            swatches.forEach(s => {
                if (s.getAttribute('data-finish') === finishKey) {
                    s.click();
                }
            });
        });
    });

    // Simulated Pairing & Active Vitals Console
    const pairBtn = document.getElementById('pair-device-btn');
    const disconnectBtn = document.getElementById('disconnect-device-btn');
    const pairingOverlay = document.getElementById('pairing-overlay');
    const metricsScreen = document.getElementById('metrics-dashboard-screen');
    const pairingStatusText = document.getElementById('pairing-status-text');
    const consoleLogs = document.getElementById('console-logs-ticker');

    let metricsInterval = null;

    function addLogEntry(text) {
        if (!consoleLogs) return;
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
        consoleLogs.appendChild(entry);
        consoleLogs.scrollTop = consoleLogs.scrollHeight;

        // Keep last 3 logs only to prevent overflow
        while (consoleLogs.children.length > 3) {
            consoleLogs.removeChild(consoleLogs.firstChild);
        }
    }

    if (pairBtn && pairingOverlay && metricsScreen) {
        pairBtn.addEventListener('click', () => {
            pairBtn.disabled = true;
            pairBtn.textContent = "Connecting...";
            pairingStatusText.textContent = "Establishing BLE link...";

            setTimeout(() => {
                addLogEntry("Bluetooth pairing initialized...");
            }, 600);

            setTimeout(() => {
                addLogEntry("Decrypting AES-256 local channels...");
            }, 1200);

            setTimeout(() => {
                addLogEntry("Syncing firmware build v2.10...");
            }, 1800);

            setTimeout(() => {
                // Connection success
                pairingOverlay.classList.remove('active');
                metricsScreen.classList.add('active');
                addLogEntry("AuraRing connected successfully.");
                
                // Initialize metric fluctuations
                startMetricsStream();
            }, 2500);
        });
    }

    if (disconnectBtn) {
        disconnectBtn.addEventListener('click', () => {
            clearInterval(metricsInterval);
            pairBtn.disabled = false;
            pairBtn.textContent = "Pair & Sync Vitals";
            pairingStatusText.textContent = "AuraRing Nearby";
            
            metricsScreen.classList.remove('active');
            pairingOverlay.classList.add('active');
            
            // Reset logs
            if (consoleLogs) {
                consoleLogs.innerHTML = `
                    <div class="log-entry">System pairing initialized...</div>
                    <div class="log-entry">Calibrating temperature sensors: 36.8°C</div>
                `;
            }
        });
    }

    function startMetricsStream() {
        const hrNode = document.getElementById('sync-hr');
        const hrvNode = document.getElementById('sync-hrv');
        const spo2Node = document.getElementById('sync-spo2');

        const logTriggers = [
            "Cardiovascular stress limits: Stable",
            "NFC power dock link closed",
            "Biosensor calibration: 100% OK",
            "Skin temperature: 36.6°C (Normal)",
            "Sleep recovery stages compiling...",
            "Activity step-counter synced: +48 steps",
            "Telemetry sync rate: 100hz"
        ];

        metricsInterval = setInterval(() => {
            // Heart rate fluctuation
            const randomHR = Math.floor(68 + Math.random() * 8);
            if (hrNode) hrNode.innerHTML = `${randomHR} <span class="unit">bpm</span>`;

            // HRV fluctuation
            const randomHRV = Math.floor(61 + Math.random() * 7);
            if (hrvNode) hrvNode.innerHTML = `${randomHRV} <span class="unit">ms</span>`;

            // SpO2 fluctuation (rarely changes from 99)
            const randomSpO2 = Math.random() > 0.8 ? 100 : 99;
            if (spo2Node) spo2Node.innerHTML = `${randomSpO2} <span class="unit">%</span>`;

            // Random log ticker entry (20% chance per second)
            if (Math.random() > 0.8) {
                const logText = logTriggers[Math.floor(Math.random() * logTriggers.length)];
                addLogEntry(logText);
            }
        }, 1200);
    }

    // Dynamic color initialization
    applyThemeColors(selectedFinish);
});
