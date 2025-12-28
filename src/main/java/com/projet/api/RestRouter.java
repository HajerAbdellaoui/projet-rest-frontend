package com.projet.api;

import java.util.List;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.projet.entities.Personne;
import com.projet.service.PersonneServiceImpl;

@Path("/")
public class RestRouter {
    PersonneServiceImpl personneService = new PersonneServiceImpl();
    
    // 1. GET all personnes (liste)
    @Path("/personnes")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Personne> getAllPersonnes() {
        List<Personne> liste = personneService.getAllPersonnes();
        for(Personne p: liste) {
            System.out.println(p); // ou p.toString() si vous avez override toString()
        }
        return liste;
    }
    
    // 2. GET personne by ID
    @Path("/personnes/{id}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Personne getPersonneById(@PathParam("id") Long id) {
        Personne personne = personneService.getPersonneById(id);
        if (personne != null) {
            System.out.println(personne); // affiche la personne trouvée
        } else {
            System.out.println("Personne non trouvée avec l'ID: " + id);
        }
        return personne;
    }
    
    // 3. GET search personnes by name
    @Path("/personnes/search")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Personne> searchPersonnes(@QueryParam("nom") String nom) {
        List<Personne> liste = personneService.searchPersonnesByName(nom);
        for(Personne p: liste) {
            System.out.println(p);
        }
        return liste;
    }
    
    // 4. POST add personne
    @Path("/personnes")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, String> addPersonne(Personne personne) {
        Map<String, String> result = personneService.addPersonne(personne);
        System.out.println("Résultat de l'ajout: " + result);
        return result;
    }
    
    // 5. PUT update personne
    @Path("/personnes/{id}")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, String> updatePersonne(@PathParam("id") Long id, Personne personne) {
        // S'assurer que l'ID de l'URL correspond à l'objet Personne
        personne.setId(id);
        Map<String, String> result = personneService.updatePersonne(personne);
        System.out.println("Résultat de la modification: " + result);
        return result;
    }
    
    // 6. DELETE personne
    @Path("/personnes/{id}")
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, String> deletePersonne(@PathParam("id") Long id) {
        Map<String, String> result = personneService.deletePersonne(id);
        System.out.println("Résultat de la suppression: " + result);
        return result;
    }
}
