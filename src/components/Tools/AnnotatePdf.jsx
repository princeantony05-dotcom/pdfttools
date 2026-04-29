import EditPdf from './EditPdf';

const AnnotatePdf = (props) => {
  return (
    <div>
      <EditPdf {...props} />
      {/* The EditPdf component already contains the core UI and its own SEO section. 
          By using it here, we provide the annotation functionality under a dedicated route. */}
    </div>
  );
};

export default AnnotatePdf;
