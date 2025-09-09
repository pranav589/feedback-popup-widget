import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Textarea } from "./ui/textarea";
import { useEffect, useMemo, useState } from "react";
import tailwindStyles from "../index.css?inline";
import PropTypes from "prop-types";

const WIDGET_CONFIG = {
  colors: {
    primary: "#2563eb",
    primaryHover: "#1e40af",
    primaryLight: "#3b82f6",
    success: "#16a34a",
    successLight: "#dcfce7",
    text: "#111827",
    textSecondary: "#4b5563",
    textMuted: "#6b7280",
    textLabel: "#374151",
    border: "#e5e7eb",
    borderFocus: "#3b82f6",
    star: "#facc15",
    starEmpty: "#e5e7eb",
    starEmptyHover: "#d1d5db",
    // popover surface theming
    surface: "#ffffff",
    surfaceForeground: "#111827",
  },
  text: {
    buttonLabel: "Feedback",
    heading: "Send us your feedback",
    subheading: "We'd love to hear from you",
    successHeading: "Thank you for your feedback!",
    successMessage:
      "We appreciate your feedback. It helps us improve our product and provide better service to our customers.",
    nameLabel: "Name",
    namePlaceholder: "Enter your name",
    emailLabel: "Email",
    emailPlaceholder: "Enter your email",
    feedbackLabel: "Feedback",
    feedbackPlaceholder: "Please share your thoughts...",
    submitButton: "Submit Feedback",
    submittingButton: "Submitting...",
  },
  layout: {
    widgetPosition: "bottom-6 right-6",
    popoverWidth: "w-full max-w-md",
    popoverPadding: "p-6",
    buttonPadding: "px-6 py-3",
    formSpacing: "space-y-5",
    gridCols: "grid-cols-2",
    textareaHeight: "min-h-[100px]",
  },
};

function useRootWidgetVars(varsObj) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const prev = {};
    for (const [k, v] of Object.entries(varsObj)) {
      prev[k] = root.style.getPropertyValue(k);
      root.style.setProperty(k, v);
    }
    return () => {
      for (const [k, v] of Object.entries(prev)) {
        if (v) root.style.setProperty(k, v);
        else root.style.removeProperty(k);
      }
    };
  }, [JSON.stringify(varsObj)]);
}

Widget.propTypes = {
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

export default function Widget({ projectId }) {
  console.log({ projectId });
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(3);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(-1);

  const colorVars = useMemo(
    () => ({
      "--tbw-primary": WIDGET_CONFIG.colors.primary,
      "--tbw-primary-hover": WIDGET_CONFIG.colors.primaryHover,
      "--tbw-primary-light": WIDGET_CONFIG.colors.primaryLight,
      "--tbw-success": WIDGET_CONFIG.colors.success,
      "--tbw-success-light": WIDGET_CONFIG.colors.successLight,
      "--tbw-text": WIDGET_CONFIG.colors.text,
      "--tbw-text-secondary": WIDGET_CONFIG.colors.textSecondary,
      "--tbw-text-muted": WIDGET_CONFIG.colors.textMuted,
      "--tbw-text-label": WIDGET_CONFIG.colors.textLabel,
      "--tbw-border": WIDGET_CONFIG.colors.border,
      "--tbw-border-focus": WIDGET_CONFIG.colors.borderFocus,
      "--tbw-star": WIDGET_CONFIG.colors.star,
      "--tbw-star-empty": WIDGET_CONFIG.colors.starEmpty,
      "--tbw-star-empty-hover": WIDGET_CONFIG.colors.starEmptyHover,
      "--tbw-surface": WIDGET_CONFIG.colors.surface,
      "--tbw-surface-foreground": WIDGET_CONFIG.colors.surfaceForeground,
      "--radius": "0.5rem",
    }),
    []
  );

  useRootWidgetVars(colorVars);

  const onSelectStar = (index) => setRating(index + 1);

  const onSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    if (
      form.name.value === "" ||
      form.email.value === "" ||
      form.feedback.value === ""
    ) {
      alert("Please fill all the fields");
      return;
    }
    setIsSubmitting(true);
    const data = {
      projectId: projectId,
      name: form.name.value,
      email: form.email.value,
      message: form.feedback.value,
      starRating: rating,
    };
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/testimonial/create-testimonial`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const json = await res.json();
      await new Promise((r) => setTimeout(r, 800));
      if (json?.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setOpen(false);
        }, 3000);
      } else {
        alert(json?.msg || "Something went wrong");
      }
    } catch (err) {
      console.error("Error submitting testimonial:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{tailwindStyles}</style>
      <div
        className={`widget fixed ${WIDGET_CONFIG.layout.widgetPosition} z-50`}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              className={`group relative overflow-hidden rounded-full text-white shadow-xl hover:shadow-2xl transition-all duration-300 ease-out transform ${WIDGET_CONFIG.layout.buttonPadding} border-0 text-sm sm:text-base`}
              style={{ backgroundColor: "var(--tbw-primary)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--tbw-primary-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--tbw-primary)";
              }}
            >
              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{ backgroundColor: "var(--tbw-primary-light)" }}
              />
              <MessageIcon className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:rotate-12" />
              <span className="font-medium">
                {WIDGET_CONFIG.text.buttonLabel}
              </span>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className={`widget rounded-2xl border-0 shadow-2xl w-[calc(100vw-2rem)] max-w-md p-0 overflow-hidden animate-in slide-in-from-bottom-2 duration-300 sm:${WIDGET_CONFIG.layout.popoverWidth} sm:rounded-2xl`}
            align="end"
            side="top"
            sideOffset={8}
            style={{
              backgroundColor: "var(--tbw-surface)",
              color: "var(--tbw-surface-foreground)",
            }}
          >
            <style>{tailwindStyles}</style>

            <div className={`p-4 sm:${WIDGET_CONFIG.layout.popoverPadding}`}>
              {isSubmitted ? (
                <div className="text-center animate-in fade-in duration-500">
                  <div
                    className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4 animate-in zoom-in duration-300"
                    style={{ backgroundColor: "var(--tbw-success-light)" }}
                  >
                    <CheckIcon
                      className="w-6 h-6 sm:w-8 sm:h-8"
                      style={{ color: "var(--tbw-success)" }}
                    />
                  </div>
                  <h3
                    className="text-lg sm:text-xl font-bold mb-2"
                    style={{ color: "var(--tbw-text)" }}
                  >
                    {WIDGET_CONFIG.text.successHeading}
                  </h3>
                  <p
                    className="leading-relaxed text-sm sm:text-base"
                    style={{ color: "var(--tbw-text-secondary)" }}
                  >
                    {WIDGET_CONFIG.text.successMessage}
                  </p>
                </div>
              ) : (
                <div className="animate-in fade-in duration-300">
                  <div className="text-center mb-4 sm:mb-6">
                    <h3
                      className="text-xl sm:text-2xl font-bold mb-2"
                      style={{ color: "var(--tbw-text)" }}
                    >
                      {WIDGET_CONFIG.text.heading}
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: "var(--tbw-text-muted)" }}
                    >
                      {WIDGET_CONFIG.text.subheading}
                    </p>
                  </div>

                  <form
                    className={WIDGET_CONFIG.layout.formSpacing}
                    onSubmit={onSubmit}
                  >
                    <div
                      className={`grid grid-cols-1 sm:${WIDGET_CONFIG.layout.gridCols} gap-3 sm:gap-4`}
                    >
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-sm font-medium"
                          style={{ color: "var(--tbw-text-label)" }}
                        >
                          {WIDGET_CONFIG.text.nameLabel}
                        </Label>
                        <Input
                          id="name"
                          placeholder={WIDGET_CONFIG.text.namePlaceholder}
                          className="transition-colors duration-200 rounded- text-sm sm:text-base focus:ring-0"
                          style={{
                            borderColor: "var(--tbw-border)",
                            color: "var(--tbw-text)",
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor =
                              "var(--tbw-border-focus)";
                            e.currentTarget.style.boxShadow =
                              "0 0 0 2px var(--tbw-border-focus)";
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor =
                              "var(--tbw-border)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium"
                          style={{ color: "var(--tbw-text-label)" }}
                        >
                          {WIDGET_CONFIG.text.emailLabel}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={WIDGET_CONFIG.text.emailPlaceholder}
                          className="transition-colors duration-200 rounded-lg text-sm sm:text-base focus:ring-0"
                          style={{
                            borderColor: "var(--tbw-border)",
                            color: "var(--tbw-text)",
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor =
                              "var(--tbw-border-focus)";
                            e.currentTarget.style.boxShadow =
                              "0 0 0 2px var(--tbw-border-focus)";
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor =
                              "var(--tbw-border)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="feedback"
                        className="text-sm font-medium"
                        style={{ color: "var(--tbw-text-label)" }}
                      >
                        {WIDGET_CONFIG.text.feedbackLabel}
                      </Label>
                      <Textarea
                        id="feedback"
                        placeholder={WIDGET_CONFIG.text.feedbackPlaceholder}
                        className={`
    min-h-[80px] sm:${WIDGET_CONFIG.layout.textareaHeight} 
    transition-colors duration-200 
    rounded-lg resize-none text-sm sm:text-base focus:ring-0
  `}
                        style={{
                          borderColor: "var(--tbw-border)",
                          color: "var(--tbw-text)",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor =
                            "var(--tbw-border-focus)";
                          e.currentTarget.style.boxShadow =
                            "0 0 0 2px var(--tbw-border-focus)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor =
                            "var(--tbw-border)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-center sm:justify-start gap-1">
                        {[...Array(5)].map((_, index) => {
                          const filled =
                            hoveredStar >= 0
                              ? hoveredStar >= index
                              : rating > index;
                          return (
                            <StarIcon
                              key={index}
                              onClick={() =>
                                !isSubmitting && onSelectStar(index)
                              }
                              onMouseEnter={() => setHoveredStar(index)}
                              onMouseLeave={() => setHoveredStar(-1)}
                              className="h-6 w-6 sm:h-8 sm:w-8 cursor-pointer transition-all duration-200 transform hover:scale-110"
                              style={{
                                fill: filled
                                  ? "var(--tbw-star)"
                                  : "var(--tbw-star-empty)",
                                color: filled
                                  ? "var(--tbw-star)"
                                  : "var(--tbw-star-empty-hover)",
                                opacity: isSubmitting ? 0.5 : 1,
                                cursor: isSubmitting
                                  ? "not-allowed"
                                  : "pointer",
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full  font-medium py-2.5 sm:py-3 rounded-md transition-all duration-200 transform  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base text-white"
                        style={{ backgroundColor: "var(--tbw-primary)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "var(--tbw-primary-hover)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "var(--tbw-primary)";
                        }}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {WIDGET_CONFIG.text.submittingButton}
                          </div>
                        ) : (
                          WIDGET_CONFIG.text.submitButton
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}

function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function MessageIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
