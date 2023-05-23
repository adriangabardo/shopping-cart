# Considerations

The sections of this document are roughly in the chronological order in which I developed this project.

## General Overview

For this project, I started from the data model. I carefully considered the requirements of the application, then chose a database engine and data model that would suit said requirements.

I will go more in-depth into the data considerations under `docs/db` documentation.

Initially, I had decided that the user interactions with the application could be done with a Node CLI application. Later on, I realised that experience would be quite cumbersome and a full-fledged Express server would be better suited for a CRUD.

## Patterns

### Repository (data access)

The main pattern that I implemented in this project, was the Repository pattern for data access. This allowed me to easily separate the database interfacing away from business logic.

The initial set up for the repositories was quite time consuming, but once the first module was completed, it went smoothly.

### Models, Routes, Controllers

Once the data repositories were done, I started implementing my CLI and quickly realised it was a cumbersome solution. So I started implemented an Express server instead. At this point in time, the Express server was an afterthought and was poorly implemented.

I then spent a lot of time properly setting up the routes and controllers for my server, and eventually tweaked my Models for the repositories too.

Initially, I had set up the Models under the name Entities and made one for each database table. When I refactored them into Models, I made them so that they would match the return objects for my repositories instead.

## Fine comb

Once most of the work was completed, I did a little bit of cleaning up. I extracted out most of repetitive tasks, such as `safe_query` which was previously a `try catch` statement on every repository method.

I extracted the queries out to their own files, making the logical code much cleaner. This also made it easier to test the repositories.

## Unit tests

Lastly, but not least, I wrote a few unit tests. This really only just scraped the surface of everything that could be tested, but by this stage I have already put so much effort that there is no time left for more tests.

## Areas of Improvement

### Unit Tests

As I have already mentioned, I put so much effort elsewhere that writing unit tests ended up being left behind. I wrote a few to demonstrate my testing style, but I know the coverage is not production-ready.

### Database ORM

At the start of the project, I chose against using an ORM such as sequelize, as I haven't had much experience with the popular libraries available.

My latest projects at work have been mostly NoSQL or SQL by hand.

This decision was both good and bad, as I had a very hands on experience with writing the queries, but at times, I felt an ORM would have made the complex queries easier to build.

### Logging

I had plans to put standardised logging in place, but alas, it also was left behind as I put a whole lot of effort elsewhere.

### Error Handling

Just like logging, I know this is a big area of improvement, but I simply ran out of time.
