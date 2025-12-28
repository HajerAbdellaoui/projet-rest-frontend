package com.projet.main;

import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

public class Test {
	EntityManagerFactory emf = Persistence.createEntityManagerFactory("projet");

}
