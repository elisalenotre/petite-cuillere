import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecipeForm from "./RecipeForm";

// Mock des services utilisés par le composant
vi.mock("../../../services/recipesService", () => ({
	createRecipe: vi.fn(),
	updateRecipe: vi.fn(),
}));

// Récupération des mocks
import { createRecipe, updateRecipe } from "../../../services/recipesService";

describe("RecipeForm", () => {
	const onClose = vi.fn();
	const onRecipeAdded = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("affiche le formulaire d'ajout avec les champs requis", () => {
		render(<RecipeForm onClose={onClose} onRecipeAdded={onRecipeAdded} />);

		// Titre de la section
		expect(
			screen.getByRole("heading", { name: /ajouter une recette/i })
		).toBeInTheDocument();

		// Champs
		expect(screen.getByLabelText(/titre/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/image/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/déroulé/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/régime/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/temps/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/technique/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/difficulté/i)).toBeInTheDocument();

		// Boutons
		expect(screen.getByRole("button", { name: /ajouter/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /annuler/i })).toBeInTheDocument();
	});

	it("affiche un message d'erreur si on soumet sans remplir les champs requis", async () => {
		render(<RecipeForm onClose={onClose} onRecipeAdded={onRecipeAdded} />);

		const { container } = render(
			<RecipeForm onClose={onClose} onRecipeAdded={onRecipeAdded} />
		);

		const form = container.querySelector("form");
		expect(form).toBeTruthy();
		fireEvent.submit(form as HTMLFormElement);

		expect(
			await screen.findByText(/veuillez remplir tous les champs obligatoires/i)
		).toBeInTheDocument();
		expect(createRecipe).not.toHaveBeenCalled();
		expect(updateRecipe).not.toHaveBeenCalled();
	});

	it("soumet en mode ajout et appelle createRecipe, onRecipeAdded et onClose", async () => {
		const user = userEvent.setup();

		const mockedRecipe = {
			recettes_id: "new-1",
			title: "Salade composée",
			img: "https://example.com/salade.jpg",
			description: "Mélanger, assaisonner, servir.",
			categories: {
				regime: "Vegan",
				temps: "Rapide",
				tech_cuisson: "Sans cuisson",
				difficulty: "Facile",
			},
		} as any;

		(createRecipe as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
			mockedRecipe
		);

		render(<RecipeForm onClose={onClose} onRecipeAdded={onRecipeAdded} />);

		await user.type(screen.getByLabelText(/titre/i), "Salade composée");
		await user.type(screen.getByLabelText(/image/i), "https://example.com/salade.jpg");
		await user.type(screen.getByLabelText(/déroulé/i), "Mélanger, assaisonner, servir.");

		await user.selectOptions(screen.getByLabelText(/régime/i), "Vegan");
		await user.selectOptions(screen.getByLabelText(/temps/i), "Rapide");
		await user.selectOptions(screen.getByLabelText(/technique/i), "Sans cuisson");
		await user.selectOptions(screen.getByLabelText(/difficulté/i), "Facile");

		await user.click(screen.getByRole("button", { name: /ajouter/i }));

		expect(createRecipe).toHaveBeenCalledTimes(1);
		expect(createRecipe).toHaveBeenCalledWith({
			title: "Salade composée",
			description: "Mélanger, assaisonner, servir.",
			imgUrl: "https://example.com/salade.jpg",
			regime: "Vegan",
			temps: "Rapide",
			tech_cuisson: "Sans cuisson",
			difficulty: "Facile",
		});

		// onRecipeAdded reçoit la recette retournée par le service
		expect(onRecipeAdded).toHaveBeenCalledTimes(1);
		expect(onRecipeAdded).toHaveBeenCalledWith(mockedRecipe);

		// Le formulaire ferme
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("soumet en mode édition et appelle updateRecipe avec l'id et le payload", async () => {
		const user = userEvent.setup();

		const existingRecipe = {
			recettes_id: "rec-42",
			title: "Quiche",
			img: "https://example.com/quiche.jpg",
			description: "Cuire au four.",
			categories: {
				regime: "Végétarien",
				temps: "Plus d'1h",
				tech_cuisson: "Four",
				difficulty: "Intermédiaire",
			},
		} as any;

		const updatedRecipe = { ...existingRecipe, title: "Quiche revisitée" } as any;
		(updateRecipe as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
			updatedRecipe
		);

		render(
			<RecipeForm
				onClose={onClose}
				onRecipeAdded={onRecipeAdded}
				existingRecipe={existingRecipe}
			/>
		);

		// Le titre d'édition est visible
		expect(
			screen.getByRole("heading", { name: /modifier la recette/i })
		).toBeInTheDocument();

		// Les champs sont pré-remplis (on modifie le titre pour tester)
		const titleInput = screen.getByLabelText(/titre/i);
		await user.clear(titleInput);
		await user.type(titleInput, "Quiche revisitée");

		await user.click(screen.getByRole("button", { name: /modifier/i }));

		expect(updateRecipe).toHaveBeenCalledTimes(1);
		expect(updateRecipe).toHaveBeenCalledWith("rec-42", {
			title: "Quiche revisitée",
			description: "Cuire au four.",
			imgUrl: "https://example.com/quiche.jpg",
			regime: "Végétarien",
			temps: "Plus d'1h",
			tech_cuisson: "Four",
			difficulty: "Intermédiaire",
		});

		expect(onRecipeAdded).toHaveBeenCalledTimes(1);
		expect(onRecipeAdded).toHaveBeenCalledWith(updatedRecipe);
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
