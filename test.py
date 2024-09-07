import streamlit as st
import google.generativeai as genai
import pdfplumber
import os

# Configure the Gemini API key using environment variable
api_key = os.getenv("API_KEY")

# Set custom page configuration with a favicon and layout settings
st.set_page_config(
    page_title="AI HR",
    page_icon="favi.png",  # Replace with your favicon path
    layout="wide",
    initial_sidebar_state="expanded",
)

# Add custom styles for background image, layout, and colors
st.markdown("""
    <style>
        .main {
            background-image: url('https://i.pinimg.com/236x/55/dd/b9/55ddb9331c36ea88ae05e1d998c5f3bd.jpg');
            background-size: cover;
            color: #000;
            padding: 1.5rem;
        }
        .element-container st-emotion-cache-f31m5j e1f1d6gn4 {
            color: #fff;
        }
        .st-expander {
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 8px;
            margin-bottom: 1rem;
            padding: 1rem;
        }
        .st-expander .stExpanderHeader {
            color: #fff !important;
        }
        .css-18e3th9 {padding: 0 5rem;}
        .stTextInput > div > div > input {
            border: 2px solid #4a90e2;
        }
        .stButton > button {
            background-color: #4a90e2;
            color: white;
            border: none;
            border-radius: 8px;
        }
        .stButton > button:hover {
            background-color: #357ABD;
            transition: 0.3s;
        }
        .footer {
            position: fixed;
            left: 0;
            bottom: 0;
            width: 100%;
            background-color: #333;
            color: white;
            text-align: center;
            padding: 1rem 0;
        }
        .footer a {
            color: white;
            text-decoration: none;
        }
        .css-1ujw7ow {
            color: #0f0f0f;
        }
        .stAlert p {
            color: #333;
            font-weight: bold;
        }
        #suitability-analysis-for-ml-engineer-position {
            color: #000;
        }
        .st-b4 {
            resize: none;
        }
        .e1y5xkzn3 {
            color: #000;
        }
        h2 {
            color: black;
        }
    </style>
    """, unsafe_allow_html=True)

# Check if the API key is set
if not api_key:
    st.error("API key is not set. Please set the GEMINI_API_KEY environment variable.")
else:
    # Configure the Gemini API with the environment variable
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')

    # Prompts for different sections
    suitability_prompt = """
    You are an expert job suitability evaluator. Based on the provided job description and the candidate's resume, analyze the suitability of the candidate for the job. 
    Provide a detailed analysis highlighting key strengths, potential gaps, and a final suitability verdict.
    """

    # Function to extract text from a PDF
    def extract_text_from_pdf(pdf_file):
        text = ""
        try:
            with pdfplumber.open(pdf_file) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text() or ""
                    text += page_text
        except Exception as e:
            st.error(f"Error extracting text from PDF: {e}")
        return text

    # Function to get the Gemini response
    def get_gemini_response(prompt, resume_text, job_description):
        try:
            response = model.generate_content([prompt + "\n\nResume Text:\n" + resume_text + "\n\nJob Description:\n" + job_description])
            return response.text
        except Exception as e:
            st.error(f"Error in Gemini API response: {e}")
            return "No analysis available."

    # Streamlit UI setup
    st.markdown("<h1 style='color: black;'>🏢 AI HR by JOB MITRA</h1>", unsafe_allow_html=True)
    st.write("""
    <p style="color:#000;">Evaluate your suitability for a specific job by comparing your resume with the job description. Upload your resume in PDF format and enter the job description below. Our AI model will analyze the compatibility and provide feedback!</p>
    """, unsafe_allow_html=True)

    # Sidebar setup
    st.sidebar.image("img.png", use_column_width=True)  # Replace with your logo path
    st.sidebar.title("Guide")
    st.sidebar.write("""
    **Welcome to the AI HR!** Here's how to use the application:

    1. **Upload Your Resume:** Click on the "Upload your resume (PDF format)..." button to upload your resume. Ensure your resume is in PDF format.

    2. **Enter Job Description:** Type or paste the job description in the provided text area.

    3. **Analyze Suitability:** Click on the button to generate a detailed analysis of your suitability for the job based on your resume.
    
    **Need Help?** If you encounter any issues or have questions, please contact us at [support@example.com](mailto:support@example.com).
    """)

    # File upload widget
    uploaded_file = st.file_uploader("Upload your resume (PDF format)...", type=['pdf'])
    
    # Text area to input Job Description
    job_description = st.text_area("Enter the Job Description", placeholder="Enter Job Description")

    # Button to analyze suitability
    if st.button("Analyze Suitability"):
        if uploaded_file is not None and job_description.strip():
            # Extract text from the uploaded PDF
            extracted_text = extract_text_from_pdf(uploaded_file)

            # Use expander widget for better organization
            with st.expander("Analysis Result"):
                analysis = get_gemini_response(suitability_prompt, extracted_text, job_description)
                st.write(analysis)

            # Additional tips
            st.markdown("""
                <div class="footer">
                    <p>Created by Tech Janta Party</p>
                </div>
                """, unsafe_allow_html=True)
        else:
            st.info("Please upload your resume and enter the job description to proceed.")
