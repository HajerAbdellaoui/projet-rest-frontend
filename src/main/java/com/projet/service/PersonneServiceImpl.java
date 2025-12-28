package com.projet.service;

import java.util.*;
import javax.persistence.*;
import com.projet.entities.Personne;

public class PersonneServiceImpl implements PersonneService {
    EntityManagerFactory emf = Persistence.createEntityManagerFactory("projet");
    EntityManager em = emf.createEntityManager();

    @Override
    public List<Personne> getAllPersonnes() {
        List<Personne> personnes = new ArrayList<>();
        try {
            personnes = em.createQuery("SELECT p FROM Personne p", Personne.class).getResultList();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return personnes;
    }

    @Override
    public Map<String, String> addPersonne(Personne p) {
        Map<String, String> result = new HashMap<>();
        try {
            if (!em.getTransaction().isActive())
                em.getTransaction().begin();
            em.persist(p);
            em.getTransaction().commit();
            em.clear();
            result.put("Status", "OK");
            result.put("message", "Personne ajoutée avec succès");
            result.put("id", p.getId().toString());
        } catch (Exception e) {
            e.printStackTrace();
            if (em.getTransaction().isActive())
                em.getTransaction().rollback();
            result.put("Status", "KO");
            result.put("message", "Erreur lors de l'ajout: " + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, String> updatePersonne(Personne p) {
        Map<String, String> result = new HashMap<>();
        try {
            if (!em.getTransaction().isActive())
                em.getTransaction().begin();
            em.merge(p);
            em.getTransaction().commit();
            em.clear();
            result.put("Status", "OK");
            result.put("message", "Personne modifiée avec succès");
        } catch (Exception e) {
            e.printStackTrace();
            if (em.getTransaction().isActive())
                em.getTransaction().rollback();
            result.put("Status", "KO");
            result.put("message", "Erreur lors de la modification: " + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, String> deletePersonne(Long id) {
        Map<String, String> result = new HashMap<>();
        try {
            Personne p = em.find(Personne.class, id);
            if (p != null) {
                if (!em.getTransaction().isActive())
                    em.getTransaction().begin();
                em.remove(p);
                em.getTransaction().commit();
                em.clear();
                result.put("Status", "OK");
                result.put("message", "Personne supprimée avec succès");
            } else {
                result.put("Status", "KO");
                result.put("message", "Personne non trouvée avec l'ID: " + id);
            }
        } catch (Exception e) {
            e.printStackTrace();
            if (em.getTransaction().isActive())
                em.getTransaction().rollback();
            result.put("Status", "KO");
            result.put("message", "Erreur lors de la suppression: " + e.getMessage());
        }
        return result;
    }

    @Override
    public Personne getPersonneById(Long id) {
        try {
            if (!em.getTransaction().isActive())
                em.getTransaction().begin();
            
            // getSingleResult() est plus approprié pour une recherche par ID unique
            return em.createQuery(
                "SELECT p FROM Personne p WHERE p.id = :idPersonne",
                Personne.class
            )
            .setParameter("idPersonne", id)
            .getSingleResult();
            
        } catch (NoResultException e) {
            // Personne non trouvée
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public List<Personne> searchPersonnesByName(String nom) {
        List<Personne> personnes = new ArrayList<>();
        try {
            personnes = em.createQuery("SELECT p FROM Personne p WHERE p.nom LIKE :nom", Personne.class)
                    .setParameter("nom", "%" + nom + "%")
                    .getResultList();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return personnes;
    }
}