const https = require("https");
const streamifier = require("streamifier");

const cloudinary = require("cloudinary").v2;

const Pyq = require("../models/PYQ");

// ======================================================
// CLOUDINARY CONFIG
// ======================================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ======================================================
// HELPER - SAFE FILE NAME
// ======================================================

const createSafeFileName = (name) => {
  return String(name || "PYQ")
    .replace(/[<>:"/\\|?*]+/g, "_")
    .replace(/\s+/g, " ")
    .trim();
};

// ======================================================
// HELPER - SIGNED CLOUDINARY PDF URL
// ======================================================

const getSignedPDFUrl = (publicId) => {
  return cloudinary.utils.private_download_url(
    publicId,
    "pdf",
    {
      resource_type: "raw",
      type: "upload",
      expires_at:
        Math.floor(Date.now() / 1000) + 10 * 60,
    }
  );
};

// ======================================================
// GET ALL PYQs
// GET /api/pyq
// ======================================================

const getPYQs = async (req, res) => {
  try {
    const pyqs = await Pyq.find()
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "name email");

    return res.status(200).json({
      success: true,
      count: pyqs.length,
      pyqs,
    });
  } catch (error) {
    console.error("Get PYQs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch PYQs",
      error: error.message,
    });
  }
};

// ======================================================
// UPLOAD PYQ
// POST /api/pyq/upload
// ======================================================

const uploadPYQ = async (req, res) => {
  try {
    const {
      title,
      category,
      subject,
      year,
      classLevel,
    } = req.body;

    // -----------------------------------------------
    // BASIC VALIDATION
    // -----------------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a PDF file",
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // -----------------------------------------------
    // PDF VALIDATION
    // -----------------------------------------------

    const isPDF =
      req.file.mimetype === "application/pdf" ||
      req.file.originalname.toLowerCase().endsWith(".pdf");

    if (!isPDF) {
      return res.status(400).json({
        success: false,
        message: "Only PDF files are allowed",
      });
    }

    // -----------------------------------------------
    // 10 MB LIMIT
    // -----------------------------------------------

    const maxSize = 10 * 1024 * 1024;

    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: "PDF size must be less than 10MB",
      });
    }

    // -----------------------------------------------
    // REQUIRED FIELDS
    // -----------------------------------------------

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Exam category is required",
      });
    }

    if (!subject) {
      return res.status(400).json({
        success: false,
        message: "Subject is required",
      });
    }

    if (!year) {
      return res.status(400).json({
        success: false,
        message: "Year is required",
      });
    }

    if (!classLevel) {
      return res.status(400).json({
        success: false,
        message: "Class level is required",
      });
    }

    // -----------------------------------------------
    // TITLE
    // -----------------------------------------------

    const finalTitle =
      title?.trim() ||
      req.file.originalname.replace(/\.pdf$/i, "");

    // -----------------------------------------------
    // CLOUDINARY PUBLIC ID
    // -----------------------------------------------

    const originalName = req.file.originalname
      .replace(/\.pdf$/i, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-");

    const publicId = `${Date.now()}-${originalName}`;

    // -----------------------------------------------
    // UPLOAD BUFFER TO CLOUDINARY
    // -----------------------------------------------

    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              folder: "studygem/pyqs",
              public_id: publicId,
              resource_type: "raw",
              type: "upload",
              format: "pdf",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

        streamifier
          .createReadStream(req.file.buffer)
          .pipe(uploadStream);
      });
    };

    const cloudinaryResult =
      await uploadToCloudinary();

    // -----------------------------------------------
    // SAVE IN MONGODB
    // -----------------------------------------------

    const pyq = await Pyq.create({
      title: finalTitle,

      category: category.trim(),

      subject: subject.trim(),

      year: Number(year),

      classLevel: classLevel.trim(),

      fileUrl: cloudinaryResult.secure_url,

      filePublicId: cloudinaryResult.public_id,

      fileName: req.file.originalname,

      fileSize: req.file.size,

      mimeType: "application/pdf",

      uploadedBy: req.user.id,

      views: 0,

      downloads: 0,
    });

    return res.status(201).json({
      success: true,
      message: "PYQ uploaded successfully",
      pyq,
    });
  } catch (error) {
    console.error("Upload PYQ Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload PYQ",
      error: error.message,
    });
  }
};

// ======================================================
// VIEW PYQ
// GET /api/pyq/:id/view
// ======================================================

const viewPYQ = async (req, res) => {
  try {
    const { id } = req.params;

    const pyq = await Pyq.findById(id);

    if (!pyq) {
      return res.status(404).json({
        success: false,
        message: "PYQ not found",
      });
    }

    if (!pyq.filePublicId) {
      return res.status(404).json({
        success: false,
        message: "PDF file not found",
      });
    }

    // -----------------------------------------------
    // INCREMENT VIEW COUNT
    // -----------------------------------------------

    pyq.views = (pyq.views || 0) + 1;

    await pyq.save();

    // -----------------------------------------------
    // SIGNED CLOUDINARY URL
    // -----------------------------------------------

    const signedUrl = getSignedPDFUrl(
      pyq.filePublicId
    );

    console.log(
      "Opening signed PDF:",
      pyq.filePublicId
    );

    // -----------------------------------------------
    // OPEN PDF
    // -----------------------------------------------

    return res.redirect(signedUrl);
  } catch (error) {
    console.error("View PYQ Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to open PDF",
      error: error.message,
    });
  }
};

// ======================================================
// DOWNLOAD PYQ
// GET /api/pyq/:id/download
// ======================================================

const downloadPYQ = async (req, res) => {
  try {
    const { id } = req.params;

    const pyq = await Pyq.findById(id);

    if (!pyq) {
      return res.status(404).json({
        success: false,
        message: "PYQ not found",
      });
    }

    if (!pyq.filePublicId) {
      return res.status(404).json({
        success: false,
        message: "PDF file not found",
      });
    }

    // -----------------------------------------------
    // INCREMENT DOWNLOAD COUNT
    // -----------------------------------------------

    pyq.downloads = (pyq.downloads || 0) + 1;

    await pyq.save();

    // -----------------------------------------------
    // FILE NAME
    // -----------------------------------------------

    let fileName =
      pyq.fileName ||
      pyq.title ||
      "PYQ";

    fileName = createSafeFileName(fileName);

    fileName = fileName.replace(
      /\.pdf$/i,
      ""
    );

    fileName = `${fileName}.pdf`;

    // -----------------------------------------------
    // SIGNED CLOUDINARY URL
    // -----------------------------------------------

    const signedUrl = getSignedPDFUrl(
      pyq.filePublicId
    );

    console.log(
      "Downloading signed PDF:",
      pyq.filePublicId
    );

    // -----------------------------------------------
    // FETCH PDF FROM CLOUDINARY
    // -----------------------------------------------

    https
      .get(
        signedUrl,
        (cloudinaryResponse) => {
          // -----------------------------------------
          // CLOUDINARY ERROR
          // -----------------------------------------

          if (
            cloudinaryResponse.statusCode !== 200
          ) {
            console.error(
              "Cloudinary Download Status:",
              cloudinaryResponse.statusCode
            );

            if (!res.headersSent) {
              return res.status(502).json({
                success: false,
                message:
                  "Unable to fetch PDF from Cloudinary",
              });
            }

            return res.end();
          }

          // -----------------------------------------
          // DOWNLOAD HEADERS
          // -----------------------------------------

          res.setHeader(
            "Content-Type",
            "application/pdf"
          );

          res.setHeader(
            "Content-Disposition",
            `attachment; filename="${fileName}"`
          );

          // -----------------------------------------
          // CONTENT LENGTH
          // -----------------------------------------

          if (
            cloudinaryResponse.headers[
              "content-length"
            ]
          ) {
            res.setHeader(
              "Content-Length",
              cloudinaryResponse.headers[
                "content-length"
              ]
            );
          }

          // -----------------------------------------
          // CACHE
          // -----------------------------------------

          res.setHeader(
            "Cache-Control",
            "no-cache"
          );

          // -----------------------------------------
          // STREAM PDF
          // -----------------------------------------

          cloudinaryResponse.pipe(res);
        }
      )
      .on("error", (error) => {
        console.error(
          "PDF Stream Error:",
          error
        );

        if (!res.headersSent) {
          return res.status(500).json({
            success: false,
            message:
              "Failed to download PDF",
          });
        }

        res.end();
      });
  } catch (error) {
    console.error(
      "Download PYQ Error:",
      error
    );

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to download PDF",
        error: error.message,
      });
    }

    res.end();
  }
};

// ======================================================
// UPDATE PYQ
// PUT /api/pyq/:id
// ======================================================

const updatePYQ = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      category,
      subject,
      year,
      classLevel,
    } = req.body;

    const pyq = await Pyq.findById(id);

    if (!pyq) {
      return res.status(404).json({
        success: false,
        message: "PYQ not found",
      });
    }

    // -----------------------------------------------
    // UPDATE TEXT FIELDS
    // -----------------------------------------------

    if (
      title !== undefined &&
      title.trim()
    ) {
      pyq.title = title.trim();
    }

    if (
      category !== undefined &&
      category.trim()
    ) {
      pyq.category = category.trim();
    }

    if (
      subject !== undefined &&
      subject.trim()
    ) {
      pyq.subject = subject.trim();
    }

    if (
      year !== undefined &&
      year !== ""
    ) {
      pyq.year = Number(year);
    }

    if (
      classLevel !== undefined &&
      classLevel.trim()
    ) {
      pyq.classLevel = classLevel.trim();
    }

    // -----------------------------------------------
    // OPTIONAL PDF REPLACEMENT
    // -----------------------------------------------

    if (req.file) {
      const isPDF =
        req.file.mimetype ===
          "application/pdf" ||
        req.file.originalname
          .toLowerCase()
          .endsWith(".pdf");

      if (!isPDF) {
        return res.status(400).json({
          success: false,
          message: "Only PDF files are allowed",
        });
      }

      const maxSize =
        10 * 1024 * 1024;

      if (req.file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message:
            "PDF size must be less than 10MB",
        });
      }

      // ---------------------------------------------
      // DELETE OLD CLOUDINARY FILE
      // ---------------------------------------------

      if (pyq.filePublicId) {
        try {
          await cloudinary.uploader.destroy(
            pyq.filePublicId,
            {
              resource_type: "raw",
            }
          );
        } catch (deleteError) {
          console.error(
            "Old PDF delete error:",
            deleteError.message
          );
        }
      }

      // ---------------------------------------------
      // NEW PUBLIC ID
      // ---------------------------------------------

      const originalName =
        req.file.originalname
          .replace(/\.pdf$/i, "")
          .replace(
            /[^a-zA-Z0-9-_]/g,
            "-"
          );

      const publicId =
        `${Date.now()}-${originalName}`;

      // ---------------------------------------------
      // UPLOAD NEW PDF
      // ---------------------------------------------

      const uploadToCloudinary =
        () => {
          return new Promise(
            (
              resolve,
              reject
            ) => {
              const uploadStream =
                cloudinary.uploader.upload_stream(
                  {
                    folder:
                      "studygem/pyqs",

                    public_id:
                      publicId,

                    resource_type:
                      "raw",

                    type:
                      "upload",

                    format:
                      "pdf",
                  },
                  (
                    error,
                    result
                  ) => {
                    if (error) {
                      reject(
                        error
                      );
                    } else {
                      resolve(
                        result
                      );
                    }
                  }
                );

              streamifier
                .createReadStream(
                  req.file.buffer
                )
                .pipe(
                  uploadStream
                );
            }
          );
        };

      const result =
        await uploadToCloudinary();

      // ---------------------------------------------
      // UPDATE FILE DETAILS
      // ---------------------------------------------

      pyq.fileUrl =
        result.secure_url;

      pyq.filePublicId =
        result.public_id;

      pyq.fileName =
        req.file.originalname;

      pyq.fileSize =
        req.file.size;

      pyq.mimeType =
        "application/pdf";
    }

    await pyq.save();

    return res.status(200).json({
      success: true,
      message:
        "PYQ updated successfully",
      pyq,
    });
  } catch (error) {
    console.error(
      "Update PYQ Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update PYQ",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE PYQ
// DELETE /api/pyq/:id
// ======================================================

const deletePYQ = async (req, res) => {
  try {
    const { id } = req.params;

    const pyq =
      await Pyq.findById(id);

    if (!pyq) {
      return res.status(404).json({
        success: false,
        message: "PYQ not found",
      });
    }

    // -----------------------------------------------
    // DELETE FROM CLOUDINARY
    // -----------------------------------------------

    if (pyq.filePublicId) {
      try {
        await cloudinary.uploader.destroy(
          pyq.filePublicId,
          {
            resource_type: "raw",
          }
        );
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary Delete Error:",
          cloudinaryError.message
        );
      }
    }

    // -----------------------------------------------
    // DELETE FROM DATABASE
    // -----------------------------------------------

    await Pyq.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message:
        "PYQ deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete PYQ Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete PYQ",
      error: error.message,
    });
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getPYQs,
  uploadPYQ,
  updatePYQ,
  deletePYQ,
  viewPYQ,
  downloadPYQ,
};