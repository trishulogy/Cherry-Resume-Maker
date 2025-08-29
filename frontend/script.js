// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // === Theme Toggle Functionality ===
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });

    // === Dynamic Form Functionality ===
    const form = document.getElementById("resumeForm");
    const statusMessage = document.getElementById("status-message");

    const sectionTemplates = {
        education: `
            <div class="education-entry">
                <button type="button" class="remove-button"><i class="fas fa-times"></i></button>
                <div class="form-grid">
                    <div class="input-group">
                        <label>University / School Name</label>
                        <input type="text" name="university" placeholder="e.g., University of Technology" />
                    </div>
                    <div class="input-group">
                        <label>Degree / Level</label>
                        <input type="text" name="degree" placeholder="e.g., B.S. in Computer Science" />
                    </div>
                    <div class="input-group">
                        <label>Start Date</label>
                        <input type="month" name="universityStartDate" />
                    </div>
                    <div class="input-group">
                        <label>End Date</label>
                        <input type="month" name="universityEndDate" />
                    </div>
                    <div class="input-group full-width">
                        <label>GPA / Marks</label>
                        <input type="text" name="universityMarks" placeholder="e.g., 3.8/4.0 GPA" />
                    </div>
                </div>
            </div>
        `,
        experience: `
            <div class="experience-entry">
                <button type="button" class="remove-button"><i class="fas fa-times"></i></button>
                <div class="form-grid">
                    <div class="input-group">
                        <label>Job Title</label>
                        <input type="text" name="jobTitle" placeholder="e.g., Software Engineer" />
                    </div>
                    <div class="input-group">
                        <label>Company</label>
                        <input type="text" name="company" placeholder="e.g., Tech Innovations Inc." />
                    </div>
                    <div class="input-group">
                        <label>Start Date</label>
                        <input type="month" name="expStartDate" />
                    </div>
                    <div class="input-group">
                        <label>End Date</label>
                        <input type="month" name="expEndDate" />
                    </div>
                    <div class="input-group full-width">
                        <label>Description</label>
                        <textarea name="jobDescription" rows="4" placeholder="Describe your key responsibilities and achievements..."></textarea>
                    </div>
                </div>
            </div>
        `,
        skills: `
            <div class="skill-entry">
                <button type="button" class="remove-button"><i class="fas fa-times"></i></button>
                <div class="form-grid">
                    <div class="input-group">
                        <label>Category</label>
                        <input type="text" name="skillCategory" placeholder="e.g., Languages, Tools, Frameworks" />
                    </div>
                    <div class="input-group full-width">
                        <label>Items (comma-separated)</label>
                        <input type="text" name="skillItems" placeholder="e.g., JavaScript, Python, C++, React, Git" />
                    </div>
                </div>
            </div>
        `,
        projects: `
            <div class="project-entry">
                <button type="button" class="remove-button"><i class="fas fa-times"></i></button>
                <div class="form-grid">
                    <div class="input-group">
                        <label>Project Title</label>
                        <input type="text" name="projectTitle" placeholder="e.g., Unique Resume Builder" />
                    </div>
                    <div class="input-group">
                        <label>Project Link</label>
                        <input type="url" name="projectLink" placeholder="e.g., https://github.com/myproject" />
                    </div>
                    <div class="input-group full-width">
                        <label>Description</label>
                        <textarea name="projectDescription" rows="4" placeholder="Describe the project and your role in it..."></textarea>
                    </div>
                </div>
            </div>
        `,
        certifications: `
            <div class="certification-entry">
                <button type="button" class="remove-button"><i class="fas fa-times"></i></button>
                <div class="form-grid">
                    <div class="input-group">
                        <label>Certification Name</label>
                        <input type="text" name="certName" placeholder="e.g., AWS Certified Developer" />
                    </div>
                    <div class="input-group">
                        <label>Certificate Link</label>
                        <input type="url" name="certLink" placeholder="e.g., https://www.credly.com/users/username/badges" />
                    </div>
                    <div class="input-group full-width">
                        <label>End Date / Status</label>
                        <input type="text" name="certEndDate" placeholder="e.g., Completed or In Progress" />
                    </div>
                </div>
            </div>
        `
    };

    function addSection(sectionType) {
        const sectionContainer = document.getElementById(`${sectionType}-container`);
        if (sectionContainer && sectionTemplates[sectionType]) {
            const newEntry = document.createElement('div');
            newEntry.innerHTML = sectionTemplates[sectionType].trim();
            const entryElement = newEntry.firstElementChild;
            entryElement.classList.add('fade-in');
            sectionContainer.appendChild(entryElement);
        }
    }

    document.querySelectorAll(".add-button").forEach(button => {
        button.addEventListener("click", () => {
            const sectionType = button.getAttribute("data-section");
            addSection(sectionType);
        });
    });

    document.addEventListener('click', (e) => {
        if (e.target && e.target.closest('.remove-button')) {
            const entry = e.target.closest('.education-entry, .experience-entry, .skill-entry, .project-entry, .certification-entry');
            if (entry) entry.remove();
        }
    });

    // --- Submit Handler ---
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        statusMessage.textContent = "Generating your resume, please wait...";
        statusMessage.style.color = "#3498db";

        const getSectionData = (containerId, className, fields) => {
            const data = [];
            document.querySelectorAll(`#${containerId} .${className}`).forEach(entry => {
                const entryData = {};
                fields.forEach(field => {
                    const input = entry.querySelector(`[name="${field}"]`);
                    if (input) entryData[field] = input.value;
                });
                data.push(entryData);
            });
            return data;
        };

        const resumeData = {
            personal: {
                name: form.querySelector('input[name="name"]').value,
                email: form.querySelector('input[name="email"]').value,
                phone: form.querySelector('input[name="phone"]').value,
                linkedin: form.querySelector('input[name="linkedin"]').value,
                github: form.querySelector('input[name="github"]').value,
                about: form.querySelector('textarea[name="summary"]').value
            },
            education: getSectionData('education-container', 'education-entry',
                ['university', 'degree', 'universityStartDate', 'universityEndDate', 'universityMarks']
            ).map(edu => ({
                university: edu.university,
                degree: edu.degree,
                startDate: edu.universityStartDate,
                endDate: edu.universityEndDate,
                gpa: edu.universityMarks
            })),
            experience: getSectionData('experience-container', 'experience-entry',
                ['jobTitle', 'company', 'expStartDate', 'expEndDate', 'jobDescription']
            ).map(exp => ({
                title: exp.jobTitle,
                company: exp.company,
                startDate: exp.expStartDate,
                endDate: exp.expEndDate,
                description: exp.jobDescription ? exp.jobDescription.split('\n') : []
            })),
            skills: { languages: [], tools: [], frameworks: [] },
            projects: getSectionData('projects-container', 'project-entry',
                ['projectTitle', 'projectLink', 'projectDescription']),
            certifications: getSectionData('certifications-container', 'certification-entry',
                ['certName', 'certLink', 'certEndDate']
            ).map(cert => ({
                name: cert.certName,
                link: cert.certLink,
                date: cert.certEndDate
            }))
        };

        // --- Skills categorization ---
        getSectionData('skills-container', 'skill-entry', ['skillCategory', 'skillItems']).forEach(skill => {
            const items = skill.skillItems.split(',').map(i => i.trim());
            if (skill.skillCategory.toLowerCase().includes('language')) {
                resumeData.skills.languages.push(...items);
            } else if (skill.skillCategory.toLowerCase().includes('framework')) {
                resumeData.skills.frameworks.push(...items);
            } else {
                resumeData.skills.tools.push(...items);
            }
        });

        try {
            const res = await fetch("http://localhost:5000/api/resume/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(resumeData),
            });

            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);

                // ✅ Open PDF in new tab for preview
                window.open(url, "_blank");

                statusMessage.textContent = "Resume PDF preview opened in new tab!";
                statusMessage.style.color = "#10b981";
            } else {
                statusMessage.textContent = "Backend error. Showing preview.";
                statusMessage.style.color = "#ef4444";
                showPreview(resumeData);
            }
        } catch (err) {
            console.error("Error generating PDF:", err);
            statusMessage.textContent = "Failed to connect to server. Showing preview.";
            statusMessage.style.color = "#ef4444";
            showPreview(resumeData);
        }
    });

    // --- Fallback HTML Preview Function ---
    function showPreview(resumeData) {
        const previewWindow = window.open('', '_blank');
        if (!previewWindow) {
            statusMessage.textContent = "Error: Pop-up blocked. Please enable pop-ups for this site.";
            statusMessage.style.color = "#ef4444";
            return;
        }

        let htmlContent = `
        <html>
        <head>
            <title>${resumeData.personal.name || 'Resume'} Preview</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; color: #2c3e50; line-height: 1.6; }
                h1 { font-size: 28px; margin-bottom: 5px; }
                h2 { font-size: 18px; margin-top: 25px; border-bottom: 2px solid #ddd; padding-bottom: 5px; }
                .contact { font-size: 12px; color: #555; margin-bottom: 15px; }
                .item { margin-bottom: 15px; }
                .item h3 { margin: 0; font-size: 14px; font-weight: bold; }
                .item p { margin: 2px 0; font-size: 13px; }
                ul { margin: 5px 0 0 20px; }
            </style>
        </head>
        <body>
            <h1>${resumeData.personal.name}</h1>
            <p class="contact">
                ${resumeData.personal.email || ''} | 
                ${resumeData.personal.phone || ''} | 
                ${resumeData.personal.linkedin || ''} | 
                ${resumeData.personal.github || ''}
            </p>
            <p>${resumeData.personal.about || ''}</p>
        `;

        if (resumeData.experience?.length) {
            htmlContent += `<h2>Work Experience</h2>`;
            resumeData.experience.forEach(exp => {
                htmlContent += `
                    <div class="item">
                        <h3>${exp.title} - ${exp.company}</h3>
                        <p>${exp.startDate} - ${exp.endDate}</p>
                        <ul>${exp.description.map(d => `<li>${d}</li>`).join('')}</ul>
                    </div>
                `;
            });
        }

        if (resumeData.education?.length) {
            htmlContent += `<h2>Education</h2>`;
            resumeData.education.forEach(edu => {
                htmlContent += `
                    <div class="item">
                        <h3>${edu.degree} - ${edu.university}</h3>
                        <p>${edu.startDate} - ${edu.endDate}</p>
                        <p>GPA: ${edu.gpa || ''}</p>
                    </div>
                `;
            });
        }

        if (resumeData.skills) {
            htmlContent += `<h2>Skills</h2>`;
            if (resumeData.skills.languages.length) {
                htmlContent += `<p><b>Languages:</b> ${resumeData.skills.languages.join(', ')}</p>`;
            }
            if (resumeData.skills.tools.length) {
                htmlContent += `<p><b>Tools:</b> ${resumeData.skills.tools.join(', ')}</p>`;
            }
            if (resumeData.skills.frameworks.length) {
                htmlContent += `<p><b>Frameworks:</b> ${resumeData.skills.frameworks.join(', ')}</p>`;
            }
        }

        if (resumeData.projects?.length) {
            htmlContent += `<h2>Projects</h2>`;
            resumeData.projects.forEach(proj => {
                htmlContent += `
                    <div class="item">
                        <h3>${proj.projectTitle}</h3>
                        <p><a href="${proj.projectLink}" target="_blank">${proj.projectLink}</a></p>
                        <p>${proj.projectDescription}</p>
                    </div>
                `;
            });
        }

        if (resumeData.certifications?.length) {
            htmlContent += `<h2>Certifications</h2>`;
            resumeData.certifications.forEach(cert => {
                htmlContent += `
                    <div class="item">
                        <h3>${cert.name}</h3>
                        <p>Status: ${cert.date || ''}</p>
                        <p><a href="${cert.link}" target="_blank">${cert.link}</a></p>
                    </div>
                `;
            });
        }

        htmlContent += `</body></html>`;
        previewWindow.document.write(htmlContent);
        previewWindow.document.close();

        statusMessage.textContent = "Preview generated successfully.";
        statusMessage.style.color = "#f59e0b";
    }
});
