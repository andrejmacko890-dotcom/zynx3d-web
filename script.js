/* ==========================================================
   ZYNX3D v1.0
   Production JavaScript
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeLoader();
    initializeBackToTop();
    initializeMobileMenu();
    initializeSmoothScroll();
    initializeHeader();
    initializeRevealAnimations();
    initializeFileUpload();
    initializeUploadStep();

    initializeWizard();
    initializeProjectUpload();

    initializeSubmitValidation();

    initializeSuccessScreen();

});


/* ==========================================================
LOADER
========================================================== */

function initializeLoader() {

    const loader = document.getElementById("pageLoader");

    if (!loader) return;

    window.addEventListener("load", () => {

        loader.style.opacity = "0";

        loader.style.visibility = "hidden";

        loader.style.pointerEvents = "none";

        setTimeout(() => {

            loader.remove();

        }, 500);

    });

}

/* ==========================================================
BACK TO TOP
========================================================== */

function initializeBackToTop() {

    const button = document.getElementById("backToTop");

    if (!button) return;

    window.addEventListener("scroll", () => {

        if (window.scrollY > 500) {

            button.classList.add("show");

        } else {

            button.classList.remove("show");

        }

    });

    button.addEventListener("click", () => {

        window.scrollTo({

            top: 0,
            behavior: "smooth"

        });

    });

}

/* ==========================================================
MOBILE MENU
========================================================== */

function initializeMobileMenu() {

    const button = document.getElementById("mobileMenuButton");

    const menu = document.getElementById("mobileMenu");

    if (!button || !menu) return;

    button.addEventListener("click", () => {

        menu.classList.toggle("active");

        button.classList.toggle("active");

    });

}

/* ==========================================================
SMOOTH SCROLL
========================================================== */

function initializeSmoothScroll() {

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", e => {

            const target = document.querySelector(link.getAttribute("href"));

            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({

                behavior: "smooth"

            });

        });

    });

}

/* ==========================================================
STICKY HEADER + ACTIVE MENU
========================================================== */

function initializeHeader() {

    const header = document.getElementById("header");

    const sections = document.querySelectorAll("section[id]");

    const navLinks = document.querySelectorAll("#desktopNavigation a");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 60) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

        let current = "";

        sections.forEach(section => {

            const sectionTop = section.offsetTop - 120;

            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop &&
                window.scrollY < sectionTop + sectionHeight) {

                current = section.getAttribute("id");

            }

        });

        navLinks.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + current) {

                link.classList.add("active");

            }

        });

    });

}

/* ==========================================================
SCROLL REVEAL
========================================================== */

function initializeRevealAnimations() {

    const reveals = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if(entry.isIntersecting){

                entry.target.classList.add("active");

            }

        });

    },{

        threshold:0.15

    });

    reveals.forEach(element =>{

        observer.observe(element);

    });

}

/* ==========================================================
FILE UPLOAD
========================================================== */

function initializeFileUpload(){

    const button=document.getElementById("selectFile");

    const input=document.getElementById("modelFile");

    const info=document.getElementById("fileInfo");

    if(!button || !input) return;

    button.onclick=()=>input.click();

    input.onchange=()=>{

        const file=input.files[0];

        if(!file) return;

        info.innerHTML=`

            <div class="formCard">

                <h3>${file.name}</h3>

                <p>Veľkosť: ${(file.size/1024/1024).toFixed(2)} MB</p>

            </div>

        `;

    };

}



/* ==========================================================
UPLOAD STEP
========================================================== */

function initializeUploadStep(){

    const uploadArea = document.getElementById("uploadArea");

    const input = document.getElementById("modelFile");

    const button = document.getElementById("selectFile");

    const fileInfo = document.getElementById("fileInfo");

    const nextButton = document.getElementById("nextToStep3");

    if(!uploadArea) return;

    button.addEventListener("click", () => {

        input.click();

    });

    uploadArea.addEventListener("dragover", e => {

        e.preventDefault();

        uploadArea.classList.add("dragover");

    });

    uploadArea.addEventListener("dragleave", () => {

        uploadArea.classList.remove("dragover");

    });

    uploadArea.addEventListener("drop", e => {

        e.preventDefault();

        uploadArea.classList.remove("dragover");

        input.files = e.dataTransfer.files;

        showSelectedFile();

    });

    input.addEventListener("change", showSelectedFile);

    function showSelectedFile(){

        const file = input.files[0];

        if(!file) return;

        fileInfo.innerHTML = `

            <div class="formCard">

                <h3>Vybraný súbor</h3>

                <p><strong>Názov:</strong> ${file.name}</p>

                <p><strong>Veľkosť:</strong> ${(file.size/1024/1024).toFixed(2)} MB</p>

                <p><strong>Typ:</strong> ${file.name.split('.').pop().toUpperCase()}</p>

            </div>

        `;

        nextButton.disabled = false;

    }

}



/* ==========================================================
UPDATE PROGRESS
========================================================== */

function updateProgress(activeStep) {

    const steps = document.querySelectorAll(".wizardStep");
    const lines = document.querySelectorAll(".wizardLine");

    steps.forEach((step, index) => {

        if (index + 1 <= activeStep) {

            step.classList.add("active");

        } else {

            step.classList.remove("active");

        }

    });

    lines.forEach((line, index) => {

        if (index + 1 < activeStep) {

            line.style.background = "var(--primary)";

        } else {

            line.style.background = "#E2E8F0";

        }

    });

}

/* ==========================================================
UNIVERSAL WIZARD
========================================================== */

function initializeWizard() {

    const steps = document.querySelectorAll("[id^='step']");

    if (steps.length === 0) return;

    let currentStep = 1;

    function showStep(number) {

        currentStep = number;

        steps.forEach((step, index) => {

            step.style.display = (index + 1 === number)
                ? "block"
                : "none";

        });

        updateProgress(number);

if(number===4){

    if(document.getElementById("summaryFileName")){

        populateUploadSummary();

    }

    if(document.getElementById("summaryPartFile")){

        populateReplacementSummary();

    }

}

        window.scrollTo({

            top: 0,
            behavior: "smooth"

        });

    }

    document.querySelectorAll("[id^='next']").forEach(button => {

        button.addEventListener("click", () => {

            if (currentStep < steps.length) {

                showStep(currentStep + 1);

            }

        });

    });

    document.querySelectorAll("[id^='back']").forEach(button => {

        button.addEventListener("click", () => {

            if (currentStep > 1) {

                showStep(currentStep - 1);

            }

        });

    });

    showStep(1);

}


/* ==========================================================
PROJECT FILE UPLOAD
========================================================== */

function initializeProjectUpload() {

    const input = document.getElementById("projectFiles");
    const button = document.getElementById("selectProjectFiles");
    const info = document.getElementById("projectFileInfo");

    if (!input || !button) return;

    button.addEventListener("click", () => {

        input.click();

    });

    input.addEventListener("change", () => {

        if (!input.files.length) return;

        let html = "<div class='formCard'><h3>Vybrané súbory</h3>";

        [...input.files].forEach(file => {

            html += `<p>📄 ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)</p>`;

        });

        html += "</div>";

        info.innerHTML = html;

    });

}

/* ==========================================================
UPLOAD SUMMARY
========================================================== */

function populateUploadSummary(){

    function set(id,value){

        const element=document.getElementById(id);

        if(element){

            element.textContent=value || "-";

        }

    }

    set("summaryFirstName",document.getElementById("firstName")?.value);

    set("summaryLastName",document.getElementById("lastName")?.value);

    set("summaryEmail",document.getElementById("email")?.value);

    set("summaryPhone",document.getElementById("phone")?.value);

    set("summaryCompany",document.getElementById("company")?.value);

    set("summaryIco",document.getElementById("ico")?.value);

    set("summaryNote",document.getElementById("note")?.value);

    const file=document.getElementById("modelFile")?.files[0];

    if(file){

        set("summaryFileName",file.name);

        set("summaryFileType",file.name.split(".").pop().toUpperCase());

        set("summaryFileSize",(file.size/1024/1024).toFixed(2)+" MB");

    }

    set("summaryMaterial",document.getElementById("material")?.value);

    set("summaryColor",document.getElementById("color")?.value);

    set("summaryQuantity",document.getElementById("quantity")?.value);

    set("summaryLayerHeight",document.getElementById("layerHeight")?.value);

    set("summaryInfill",document.getElementById("infill")?.value);

    set("summaryStrength",document.getElementById("strength")?.value);

    set("summaryPrintNote",document.getElementById("printNote")?.value);

}

/* ==========================================================
SUBMIT VALIDATION
========================================================== */

function initializeSubmitValidation(){

    const confirm = document.getElementById("confirmData");
    const gdpr = document.getElementById("gdprConsent");
    const terms = document.getElementById("termsConsent");
    const submit = document.getElementById("submitInquiry");

    if(!submit) return;

    function validate(){

        submit.disabled = !(

            confirm?.checked &&
            gdpr?.checked &&
            terms?.checked

        );

    }

    confirm?.addEventListener("change", validate);
    gdpr?.addEventListener("change", validate);
    terms?.addEventListener("change", validate);

    validate();

}

/* ==========================================================
SUCCESS SCREEN
========================================================== */

function initializeSuccessScreen(){

    const submit=document.getElementById("submitInquiry");

    if(!submit) return;

submit.addEventListener("click",(event)=>{

    event.preventDefault();

document.getElementById("step4").style.display = "none";

document.getElementById("successScreen").style.display = "block";

document.getElementById("successScreen").scrollIntoView({

    behavior: "smooth"

});

});

}

/* ==========================================================
REPLACEMENT PART SUMMARY
========================================================== */

function populateReplacementSummary(){

    function set(id,value){

        const element=document.getElementById(id);

        if(element){

            element.textContent=value || "-";

        }

    }

    /* Kontaktné údaje */

    set("summaryFirstName",document.getElementById("firstName")?.value);

    set("summaryLastName",document.getElementById("lastName")?.value);

    set("summaryEmail",document.getElementById("email")?.value);

    set("summaryPhone",document.getElementById("phone")?.value);

    set("summaryCompany",document.getElementById("company")?.value);

    set("summaryIco",document.getElementById("ico")?.value);

    set("summaryNote",document.getElementById("note")?.value);

    /* Fotografie */

    const photos=document.getElementById("photoFiles")?.files;

    if(photos && photos.length){

        set(

            "summaryPhotos",

            [...photos].map(file=>file.name).join(", ")

        );

    }

    /* Nahraný diel */

    const part=document.getElementById("partFile")?.files[0];

    if(part){

        set("summaryPartFile",part.name);

    }

    /* Parametre */

    set("summaryDimensions",document.getElementById("dimensions")?.value);

    set("summaryMaterial",document.getElementById("material")?.value);

    set("summaryUsage",document.getElementById("usage")?.value);

    set("summaryLoad",document.getElementById("load")?.value);

    set("summaryQuantity",document.getElementById("quantity")?.value);

}